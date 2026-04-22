#include "imgui.h"
#include "imgui_impl_opengl3.h"
#include "imgui_impl_sdl2.h"
#include "implot.h"

#include <SDL.h>

#if defined(IMGUI_IMPL_OPENGL_ES2)
#include <SDL_opengles2.h>
#else
#include <SDL_opengl.h>
#endif

#include <emscripten/emscripten.h>
#include <emscripten/em_js.h>

#include <cfloat>
#include <cstdint>
#include <string>
#include <vector>

namespace {

struct RuntimeState {
    SDL_Window* window = nullptr;
    SDL_GLContext gl_context = nullptr;
    bool initialized = false;
    bool host_window_open = false;
    ImVec4 clear_color = ImVec4(0.0f, 0.0f, 0.0f, 0.0f);
};

RuntimeState g_runtime;

struct PendingPlotStyle {
    ImPlotSpec spec;
    bool active = false;
};

PendingPlotStyle g_next_plot_style;

ImVec4 ColorFrom(double r, double g, double b, double a) {
    return ImVec4(static_cast<float>(r), static_cast<float>(g), static_cast<float>(b), static_cast<float>(a));
}

ImVec2 Vec2From(double x, double y) {
    return ImVec2(static_cast<float>(x), static_cast<float>(y));
}

ImPlotPoint PlotPointFrom(double x, double y) {
    return ImPlotPoint(x, y);
}

ImPlotSpec MakePlotSpec(int flags = 0) {
    ImPlotSpec spec = g_next_plot_style.active ? g_next_plot_style.spec : ImPlotSpec();
    spec.Flags = static_cast<ImPlotItemFlags>(static_cast<int>(spec.Flags) | flags);
    g_next_plot_style = PendingPlotStyle();
    return spec;
}

bool EnsureRuntime() {
    if (g_runtime.initialized) {
        return true;
    }

    if (SDL_Init(SDL_INIT_VIDEO | SDL_INIT_TIMER) != 0) {
        SDL_Log("SDL_Init failed: %s", SDL_GetError());
        return false;
    }

    const char* glsl_version = "#version 100";
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_FLAGS, 0);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_ES);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 2);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 0);
    SDL_GL_SetAttribute(SDL_GL_DOUBLEBUFFER, 1);
    SDL_GL_SetAttribute(SDL_GL_DEPTH_SIZE, 24);
    SDL_GL_SetAttribute(SDL_GL_STENCIL_SIZE, 8);
    SDL_GL_SetAttribute(SDL_GL_ALPHA_SIZE, 8);

    g_runtime.window = SDL_CreateWindow(
        "implotjs",
        SDL_WINDOWPOS_CENTERED,
        SDL_WINDOWPOS_CENTERED,
        1280,
        720,
        SDL_WINDOW_OPENGL | SDL_WINDOW_RESIZABLE | SDL_WINDOW_ALLOW_HIGHDPI
    );
    if (g_runtime.window == nullptr) {
        SDL_Log("SDL_CreateWindow failed: %s", SDL_GetError());
        SDL_Quit();
        return false;
    }

    g_runtime.gl_context = SDL_GL_CreateContext(g_runtime.window);
    if (g_runtime.gl_context == nullptr) {
        SDL_Log("SDL_GL_CreateContext failed: %s", SDL_GetError());
        SDL_DestroyWindow(g_runtime.window);
        g_runtime.window = nullptr;
        SDL_Quit();
        return false;
    }

    SDL_GL_MakeCurrent(g_runtime.window, g_runtime.gl_context);

    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImPlot::CreateContext();

    ImGuiIO& io = ImGui::GetIO();
    io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;
    io.IniFilename = nullptr;
    io.LogFilename = nullptr;

    ImGui::StyleColorsDark();
    ImPlot::StyleColorsDark();

    ImGui_ImplSDL2_InitForOpenGL(g_runtime.window, g_runtime.gl_context);
    ImGui_ImplOpenGL3_Init(glsl_version);

    g_runtime.initialized = true;
    return true;
}

void ShutdownRuntime() {
    if (!g_runtime.initialized) {
        return;
    }

    if (g_runtime.host_window_open) {
        ImGui::End();
        g_runtime.host_window_open = false;
    }

    ImPlot::DestroyContext();
    ImGui_ImplOpenGL3_Shutdown();
    ImGui_ImplSDL2_Shutdown();
    ImGui::DestroyContext();

    if (g_runtime.gl_context != nullptr) {
        SDL_GL_DeleteContext(g_runtime.gl_context);
        g_runtime.gl_context = nullptr;
    }
    if (g_runtime.window != nullptr) {
        SDL_DestroyWindow(g_runtime.window);
        g_runtime.window = nullptr;
    }
    SDL_Quit();
    g_runtime.initialized = false;
}

void WriteVec2(double* out, const ImVec2& value) {
    if (out == nullptr) {
        return;
    }
    out[0] = value.x;
    out[1] = value.y;
}

void WriteVec4(double* out, const ImVec4& value) {
    if (out == nullptr) {
        return;
    }
    out[0] = value.x;
    out[1] = value.y;
    out[2] = value.z;
    out[3] = value.w;
}

void WritePlotPoint(double* out, const ImPlotPoint& value) {
    if (out == nullptr) {
        return;
    }
    out[0] = value.x;
    out[1] = value.y;
}

void WritePlotRect(double* out, const ImPlotRect& value) {
    if (out == nullptr) {
        return;
    }
    out[0] = value.X.Min;
    out[1] = value.X.Max;
    out[2] = value.Y.Min;
    out[3] = value.Y.Max;
}

} // namespace

int main(int, char**) {
    EnsureRuntime();
    return 0;
}

#define EXPORT extern "C" EMSCRIPTEN_KEEPALIVE

// Forward declarations for JS callback bridges
ImPlotPoint GetterCallbackBridge(int idx, void* user_data);
double TransformForwardBridge(double value, void* user_data);
double TransformInverseBridge(double value, void* user_data);
int FormatterCallbackBridge(double value, char* buff, int size, void* user_data);

EXPORT int implotjs_begin_frame(int width, int height) {
    if (!EnsureRuntime()) {
        return 0;
    }

    if (width > 0 && height > 0) {
        SDL_SetWindowSize(g_runtime.window, width, height);
    }

    SDL_Event event;
    while (SDL_PollEvent(&event)) {
        ImGui_ImplSDL2_ProcessEvent(&event);
    }

    ImGui_ImplOpenGL3_NewFrame();
    ImGui_ImplSDL2_NewFrame();
    ImGui::NewFrame();

    ImGuiIO& io = ImGui::GetIO();
    ImGui::SetNextWindowPos(ImVec2(0.0f, 0.0f), ImGuiCond_Always);
    ImGui::SetNextWindowSize(io.DisplaySize, ImGuiCond_Always);
    ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(0.0f, 0.0f));
    ImGuiWindowFlags host_flags =
        ImGuiWindowFlags_NoDecoration |
        ImGuiWindowFlags_NoMove |
        ImGuiWindowFlags_NoSavedSettings |
        ImGuiWindowFlags_NoBringToFrontOnFocus |
        ImGuiWindowFlags_NoNavFocus |
        ImGuiWindowFlags_NoBackground;
    ImGui::Begin("##implotjs_host", nullptr, host_flags);
    g_runtime.host_window_open = true;
    return 1;
}

EXPORT void implotjs_end_frame() {
    if (!g_runtime.initialized) {
        return;
    }

    if (g_runtime.host_window_open) {
        ImGui::End();
        ImGui::PopStyleVar();
        g_runtime.host_window_open = false;
    }

    ImGui::Render();
    glViewport(0, 0, static_cast<int>(ImGui::GetIO().DisplaySize.x), static_cast<int>(ImGui::GetIO().DisplaySize.y));
    glClearColor(
        g_runtime.clear_color.x * g_runtime.clear_color.w,
        g_runtime.clear_color.y * g_runtime.clear_color.w,
        g_runtime.clear_color.z * g_runtime.clear_color.w,
        g_runtime.clear_color.w
    );
    glClear(GL_COLOR_BUFFER_BIT);
    ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
    SDL_GL_SwapWindow(g_runtime.window);
}

EXPORT void implotjs_shutdown() {
    ShutdownRuntime();
}

EXPORT void implotjs_resize(int width, int height) {
    if (!EnsureRuntime()) {
        return;
    }
    SDL_SetWindowSize(g_runtime.window, width, height);
}

EXPORT int implotjs_begin_plot(const char* title_id, double width, double height, int flags) {
    return ImPlot::BeginPlot(title_id, Vec2From(width, height), flags) ? 1 : 0;
}

EXPORT void implotjs_end_plot() {
    ImPlot::EndPlot();
}

EXPORT int implotjs_begin_legend_popup(const char* label_id, int mouse_button) {
    return ImPlot::BeginLegendPopup(label_id, mouse_button) ? 1 : 0;
}

EXPORT void implotjs_end_legend_popup() {
    ImPlot::EndLegendPopup();
}

EXPORT int implotjs_is_legend_entry_hovered(const char* label_id) {
    return ImPlot::IsLegendEntryHovered(label_id) ? 1 : 0;
}

EXPORT int implotjs_begin_aligned_plots(const char* group_id, int vertical) {
    return ImPlot::BeginAlignedPlots(group_id, vertical != 0) ? 1 : 0;
}

EXPORT void implotjs_end_aligned_plots() {
    ImPlot::EndAlignedPlots();
}

EXPORT int implotjs_begin_subplots(const char* title_id, int rows, int cols, double width, double height, int flags) {
    return ImPlot::BeginSubplots(title_id, rows, cols, Vec2From(width, height), flags) ? 1 : 0;
}

EXPORT void implotjs_end_subplots() {
    ImPlot::EndSubplots();
}

EXPORT void implotjs_setup_axis(int axis, const char* label, int flags) {
    ImPlot::SetupAxis(axis, label, flags);
}

EXPORT void implotjs_setup_axis_limits(int axis, double v_min, double v_max, int cond) {
    ImPlot::SetupAxisLimits(axis, v_min, v_max, cond);
}

EXPORT void implotjs_setup_axis_format(int axis, const char* fmt) {
    ImPlot::SetupAxisFormat(axis, fmt);
}

EXPORT void implotjs_setup_axis_ticks_values(int axis, const double* values, int count, const char* const* labels, int label_count, int keep_default) {
    if (labels != nullptr && label_count > 0) {
        ImPlot::SetupAxisTicks(axis, values, count, labels, keep_default != 0);
    } else {
        ImPlot::SetupAxisTicks(axis, values, count, nullptr, keep_default != 0);
    }
}

EXPORT void implotjs_setup_axis_ticks_range(int axis, double v_min, double v_max, int count, int keep_default) {
    ImPlot::SetupAxisTicks(axis, v_min, v_max, count, nullptr, keep_default != 0);
}

EXPORT void implotjs_setup_axis_scale(int axis, int scale) {
    ImPlot::SetupAxisScale(axis, static_cast<ImPlotScale>(scale));
}

EXPORT void implotjs_setup_axis_scale_transform(int axis, int cb_id) {
    ImPlot::SetupAxisScale(axis, TransformForwardBridge, TransformInverseBridge, reinterpret_cast<void*>(static_cast<intptr_t>(cb_id)));
}

EXPORT void implotjs_setup_axis_format_callback(int axis, int cb_id) {
    ImPlot::SetupAxisFormat(axis, FormatterCallbackBridge, reinterpret_cast<void*>(static_cast<intptr_t>(cb_id)));
}

EXPORT void implotjs_setup_axis_links(int axis, double* link_min, double* link_max) {
    ImPlot::SetupAxisLinks(axis, link_min, link_max);
}

EXPORT void implotjs_setup_axis_limits_constraints(int axis, double v_min, double v_max) {
    ImPlot::SetupAxisLimitsConstraints(axis, v_min, v_max);
}

EXPORT void implotjs_setup_axis_zoom_constraints(int axis, double z_min, double z_max) {
    ImPlot::SetupAxisZoomConstraints(axis, z_min, z_max);
}

EXPORT void implotjs_setup_axes(const char* x_label, const char* y_label, int x_flags, int y_flags) {
    ImPlot::SetupAxes(x_label, y_label, x_flags, y_flags);
}

EXPORT void implotjs_setup_axes_limits(double x_min, double x_max, double y_min, double y_max, int cond) {
    ImPlot::SetupAxesLimits(x_min, x_max, y_min, y_max, cond);
}

EXPORT void implotjs_setup_legend(int location, int flags) {
    ImPlot::SetupLegend(location, flags);
}

EXPORT void implotjs_setup_mouse_text(int location, int flags) {
    ImPlot::SetupMouseText(location, flags);
}

EXPORT void implotjs_setup_finish() {
    ImPlot::SetupFinish();
}

EXPORT void implotjs_set_next_axis_limits(int axis, double v_min, double v_max, int cond) {
    ImPlot::SetNextAxisLimits(axis, v_min, v_max, cond);
}

EXPORT void implotjs_set_next_axis_to_fit(int axis) {
    ImPlot::SetNextAxisToFit(axis);
}

EXPORT void implotjs_set_next_axis_links(int axis, double* link_min, double* link_max) {
    ImPlot::SetNextAxisLinks(axis, link_min, link_max);
}

EXPORT void implotjs_set_next_axes_limits(double x_min, double x_max, double y_min, double y_max, int cond) {
    ImPlot::SetNextAxesLimits(x_min, x_max, y_min, y_max, cond);
}

EXPORT void implotjs_set_next_axes_to_fit() {
    ImPlot::SetNextAxesToFit();
}

//---------------------------------------------------------------------------
// JS Callback Bridges
//---------------------------------------------------------------------------

EM_JS(void, implotjs_getter_callback, (int cb_id, int idx, double* out_x, double* out_y), {
    var fn = Module['__implotjs_getters'][cb_id];
    var pt = fn(idx);
    if (typeof pt === 'object' && pt !== null) {
        HEAPF64[out_x >> 3] = pt.x !== undefined ? pt.x : (pt[0] !== undefined ? pt[0] : 0);
        HEAPF64[out_y >> 3] = pt.y !== undefined ? pt.y : (pt[1] !== undefined ? pt[1] : 0);
    } else {
        HEAPF64[out_x >> 3] = 0;
        HEAPF64[out_y >> 3] = 0;
    }
});

EM_JS(double, implotjs_transform_forward_callback, (int cb_id, double value), {
    var fn = Module['__implotjs_transforms'][cb_id];
    return fn.forward(value);
});

EM_JS(double, implotjs_transform_inverse_callback, (int cb_id, double value), {
    var fn = Module['__implotjs_transforms'][cb_id];
    return fn.inverse(value);
});

EM_JS(int, implotjs_formatter_callback, (int cb_id, double value, char* buff, int size), {
    var fn = Module['__implotjs_formatters'][cb_id];
    var str = String(fn(value));
    var bytes = new TextEncoder().encode(str);
    var len = Math.min(bytes.length, size - 1);
    for (var i = 0; i < len; ++i) {
        HEAPU8[buff + i] = bytes[i];
    }
    HEAPU8[buff + len] = 0;
    return len;
});

ImPlotPoint GetterCallbackBridge(int idx, void* user_data) {
    int cb_id = static_cast<int>(reinterpret_cast<intptr_t>(user_data));
    double x = 0, y = 0;
    implotjs_getter_callback(cb_id, idx, &x, &y);
    return ImPlotPoint(x, y);
}

double TransformForwardBridge(double value, void* user_data) {
    int cb_id = static_cast<int>(reinterpret_cast<intptr_t>(user_data));
    return implotjs_transform_forward_callback(cb_id, value);
}

double TransformInverseBridge(double value, void* user_data) {
    int cb_id = static_cast<int>(reinterpret_cast<intptr_t>(user_data));
    return implotjs_transform_inverse_callback(cb_id, value);
}

int FormatterCallbackBridge(double value, char* buff, int size, void* user_data) {
    int cb_id = static_cast<int>(reinterpret_cast<intptr_t>(user_data));
    return implotjs_formatter_callback(cb_id, value, buff, size);
}

EXPORT void implotjs_plot_line_y(const char* label_id, const double* ys, int count, double xscale, double xstart, int flags) {
    ImPlot::PlotLine<double>(label_id, ys, count, xscale, xstart, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_line_xy(const char* label_id, const double* xs, const double* ys, int count, int flags) {
    ImPlot::PlotLine<double>(label_id, xs, ys, count, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_scatter_y(const char* label_id, const double* ys, int count, double xscale, double xstart, int flags) {
    ImPlot::PlotScatter<double>(label_id, ys, count, xscale, xstart, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_scatter_xy(const char* label_id, const double* xs, const double* ys, int count, int flags) {
    ImPlot::PlotScatter<double>(label_id, xs, ys, count, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_line_g(const char* label_id, int cb_id, int count, int flags) {
    ImPlot::PlotLineG(label_id, GetterCallbackBridge, reinterpret_cast<void*>(static_cast<intptr_t>(cb_id)), count, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_scatter_g(const char* label_id, int cb_id, int count, int flags) {
    ImPlot::PlotScatterG(label_id, GetterCallbackBridge, reinterpret_cast<void*>(static_cast<intptr_t>(cb_id)), count, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_stairs_g(const char* label_id, int cb_id, int count, int flags) {
    ImPlot::PlotStairsG(label_id, GetterCallbackBridge, reinterpret_cast<void*>(static_cast<intptr_t>(cb_id)), count, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_bubbles_y(const char* label_id, const double* values, const double* szs, int count, double xscale, double xstart, int flags) {
    ImPlot::PlotBubbles<double>(label_id, values, szs, count, xscale, xstart, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_bubbles_xy(const char* label_id, const double* xs, const double* ys, const double* szs, int count, int flags) {
    ImPlot::PlotBubbles<double>(label_id, xs, ys, szs, count, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_polygon(const char* label_id, const double* xs, const double* ys, int count, int flags) {
    ImPlot::PlotPolygon<double>(label_id, xs, ys, count, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_stairs_y(const char* label_id, const double* ys, int count, double xscale, double xstart, int flags) {
    ImPlot::PlotStairs<double>(label_id, ys, count, xscale, xstart, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_stairs_xy(const char* label_id, const double* xs, const double* ys, int count, int flags) {
    ImPlot::PlotStairs<double>(label_id, xs, ys, count, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_shaded_y(const char* label_id, const double* ys, int count, double yref, double xscale, double xstart, int flags) {
    ImPlot::PlotShaded<double>(label_id, ys, count, yref, xscale, xstart, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_shaded_xy(const char* label_id, const double* xs, const double* ys, int count, double yref, int flags) {
    ImPlot::PlotShaded<double>(label_id, xs, ys, count, yref, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_shaded_xy2(const char* label_id, const double* xs, const double* ys1, const double* ys2, int count, int flags) {
    ImPlot::PlotShaded<double>(label_id, xs, ys1, ys2, count, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_bars_y(const char* label_id, const double* ys, int count, double bar_size, double shift, int flags) {
    ImPlot::PlotBars<double>(label_id, ys, count, bar_size, shift, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_bars_xy(const char* label_id, const double* xs, const double* ys, int count, double bar_size, int flags) {
    ImPlot::PlotBars<double>(label_id, xs, ys, count, bar_size, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_bar_groups(const char* const* label_ids, const double* values, int item_count, int group_count, double group_size, double shift, int flags) {
    ImPlot::PlotBarGroups<double>(label_ids, values, item_count, group_count, group_size, shift, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_error_bars(const char* label_id, const double* xs, const double* ys, const double* err, int count, int flags) {
    ImPlot::PlotErrorBars<double>(label_id, xs, ys, err, count, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_error_bars2(const char* label_id, const double* xs, const double* ys, const double* neg, const double* pos, int count, int flags) {
    ImPlot::PlotErrorBars<double>(label_id, xs, ys, neg, pos, count, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_stems_y(const char* label_id, const double* ys, int count, double ref, double scale, double start, int flags) {
    ImPlot::PlotStems<double>(label_id, ys, count, ref, scale, start, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_stems_xy(const char* label_id, const double* xs, const double* ys, int count, double ref, int flags) {
    ImPlot::PlotStems<double>(label_id, xs, ys, count, ref, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_inf_lines(const char* label_id, const double* values, int count, int flags) {
    ImPlot::PlotInfLines<double>(label_id, values, count, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_pie_chart(const char* const* label_ids, const double* values, int count, double x, double y, double radius, const char* label_fmt, double angle0, int flags) {
    ImPlot::PlotPieChart<double>(label_ids, values, count, x, y, radius, label_fmt, angle0, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_heatmap(const char* label_id, const double* values, int rows, int cols, double scale_min, double scale_max, const char* label_fmt, double x_min, double y_min, double x_max, double y_max, int flags) {
    ImPlot::PlotHeatmap<double>(
        label_id,
        values,
        rows,
        cols,
        scale_min,
        scale_max,
        label_fmt,
        PlotPointFrom(x_min, y_min),
        PlotPointFrom(x_max, y_max),
        MakePlotSpec(flags)
    );
}

EXPORT double implotjs_plot_histogram(const char* label_id, const double* values, int count, int bins, double bar_scale, double range_min, double range_max, int use_range, int flags) {
    ImPlotRange range = use_range ? ImPlotRange(range_min, range_max) : ImPlotRange();
    return ImPlot::PlotHistogram<double>(label_id, values, count, bins, bar_scale, range, MakePlotSpec(flags));
}

EXPORT double implotjs_plot_histogram_2d(const char* label_id, const double* xs, const double* ys, int count, int x_bins, int y_bins, double x_min, double x_max, double y_min, double y_max, int use_range, int flags) {
    ImPlotRect range = use_range ? ImPlotRect(x_min, x_max, y_min, y_max) : ImPlotRect();
    return ImPlot::PlotHistogram2D<double>(label_id, xs, ys, count, x_bins, y_bins, range, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_digital(const char* label_id, const double* xs, const double* ys, int count, int flags) {
    ImPlot::PlotDigital<double>(label_id, xs, ys, count, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_digital_g(const char* label_id, int cb_id, int count, int flags) {
    ImPlot::PlotDigitalG(label_id, GetterCallbackBridge, reinterpret_cast<void*>(static_cast<intptr_t>(cb_id)), count, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_bars_g(const char* label_id, int cb_id, int count, double bar_size, int flags) {
    ImPlot::PlotBarsG(label_id, GetterCallbackBridge, reinterpret_cast<void*>(static_cast<intptr_t>(cb_id)), count, bar_size, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_shaded_g(const char* label_id, int cb_id1, int cb_id2, int count, int flags) {
    auto getter1 = [](int idx, void* data) -> ImPlotPoint {
        int cb_id = static_cast<int>(reinterpret_cast<intptr_t>(data));
        double x = 0, y = 0;
        implotjs_getter_callback(cb_id, idx, &x, &y);
        return ImPlotPoint(x, y);
    };
    auto getter2 = [](int idx, void* data) -> ImPlotPoint {
        int cb_id = static_cast<int>(reinterpret_cast<intptr_t>(data));
        double x = 0, y = 0;
        implotjs_getter_callback(cb_id, idx, &x, &y);
        return ImPlotPoint(x, y);
    };
    ImPlot::PlotShadedG(label_id, getter1, reinterpret_cast<void*>(static_cast<intptr_t>(cb_id1)), getter2, reinterpret_cast<void*>(static_cast<intptr_t>(cb_id2)), count, MakePlotSpec(flags));
}

EXPORT void implotjs_plot_image(const char* label_id, double texture_id, double x_min, double y_min, double x_max, double y_max, double u0, double v0, double u1, double v1, double r, double g, double b, double a, int flags) {
    ImPlot::PlotImage(
        label_id,
        static_cast<ImTextureID>(static_cast<uintptr_t>(texture_id)),
        PlotPointFrom(x_min, y_min),
        PlotPointFrom(x_max, y_max),
        Vec2From(u0, v0),
        Vec2From(u1, v1),
        ColorFrom(r, g, b, a),
        MakePlotSpec(flags)
    );
}

EXPORT void implotjs_plot_text(const char* text, double x, double y, double offset_x, double offset_y, int flags) {
    ImPlot::PlotText(text, x, y, Vec2From(offset_x, offset_y), MakePlotSpec(flags));
}

EXPORT void implotjs_plot_dummy(const char* label_id, int flags) {
    ImPlot::PlotDummy(label_id, MakePlotSpec(flags));
}

EXPORT int implotjs_drag_point(int id, double* x, double* y, double r, double g, double b, double a, float size, int flags, unsigned char* states) {
    bool clicked = false;
    bool hovered = false;
    bool held = false;
    bool changed = ImPlot::DragPoint(id, x, y, ColorFrom(r, g, b, a), size, flags, &clicked, &hovered, &held);
    if (states != nullptr) {
        states[0] = clicked ? 1 : 0;
        states[1] = hovered ? 1 : 0;
        states[2] = held ? 1 : 0;
    }
    return changed ? 1 : 0;
}

EXPORT int implotjs_drag_line_x(int id, double* x, double r, double g, double b, double a, float thickness, int flags, unsigned char* states) {
    bool clicked = false;
    bool hovered = false;
    bool held = false;
    bool changed = ImPlot::DragLineX(id, x, ColorFrom(r, g, b, a), thickness, flags, &clicked, &hovered, &held);
    if (states != nullptr) {
        states[0] = clicked ? 1 : 0;
        states[1] = hovered ? 1 : 0;
        states[2] = held ? 1 : 0;
    }
    return changed ? 1 : 0;
}

EXPORT int implotjs_drag_line_y(int id, double* y, double r, double g, double b, double a, float thickness, int flags, unsigned char* states) {
    bool clicked = false;
    bool hovered = false;
    bool held = false;
    bool changed = ImPlot::DragLineY(id, y, ColorFrom(r, g, b, a), thickness, flags, &clicked, &hovered, &held);
    if (states != nullptr) {
        states[0] = clicked ? 1 : 0;
        states[1] = hovered ? 1 : 0;
        states[2] = held ? 1 : 0;
    }
    return changed ? 1 : 0;
}

EXPORT int implotjs_drag_rect(int id, double* x1, double* y1, double* x2, double* y2, double r, double g, double b, double a, int flags, unsigned char* states) {
    bool clicked = false;
    bool hovered = false;
    bool held = false;
    bool changed = ImPlot::DragRect(id, x1, y1, x2, y2, ColorFrom(r, g, b, a), flags, &clicked, &hovered, &held);
    if (states != nullptr) {
        states[0] = clicked ? 1 : 0;
        states[1] = hovered ? 1 : 0;
        states[2] = held ? 1 : 0;
    }
    return changed ? 1 : 0;
}

EXPORT void implotjs_annotation(double x, double y, double r, double g, double b, double a, double offset_x, double offset_y, int clamp, const char* text) {
    ImPlot::Annotation(x, y, ColorFrom(r, g, b, a), Vec2From(offset_x, offset_y), clamp != 0, "%s", text != nullptr ? text : "");
}

EXPORT void implotjs_tag_x(double x, double r, double g, double b, double a, const char* text) {
    ImPlot::TagX(x, ColorFrom(r, g, b, a), "%s", text != nullptr ? text : "");
}

EXPORT void implotjs_tag_y(double y, double r, double g, double b, double a, const char* text) {
    ImPlot::TagY(y, ColorFrom(r, g, b, a), "%s", text != nullptr ? text : "");
}

EXPORT void implotjs_set_axis(int axis) {
    ImPlot::SetAxis(axis);
}

EXPORT void implotjs_set_axes(int x_axis, int y_axis) {
    ImPlot::SetAxes(x_axis, y_axis);
}

EXPORT void implotjs_get_plot_pos(double* out) {
    WriteVec2(out, ImPlot::GetPlotPos());
}

EXPORT void implotjs_get_plot_size(double* out) {
    WriteVec2(out, ImPlot::GetPlotSize());
}

EXPORT void implotjs_get_plot_mouse_pos(double* out, int x_axis, int y_axis) {
    WritePlotPoint(out, ImPlot::GetPlotMousePos(x_axis, y_axis));
}

EXPORT void implotjs_get_plot_limits(double* out, int x_axis, int y_axis) {
    WritePlotRect(out, ImPlot::GetPlotLimits(x_axis, y_axis));
}

EXPORT int implotjs_is_plot_hovered() {
    return ImPlot::IsPlotHovered() ? 1 : 0;
}

EXPORT int implotjs_is_subplots_hovered() {
    return ImPlot::IsSubplotsHovered() ? 1 : 0;
}

EXPORT void implotjs_push_plot_clip_rect(float expand) {
    ImPlot::PushPlotClipRect(expand);
}

EXPORT void implotjs_pop_plot_clip_rect() {
    ImPlot::PopPlotClipRect();
}

EXPORT int implotjs_is_axis_hovered(int axis) {
    return ImPlot::IsAxisHovered(axis) ? 1 : 0;
}

EXPORT int implotjs_is_plot_selected() {
    return ImPlot::IsPlotSelected() ? 1 : 0;
}

EXPORT void implotjs_get_plot_selection(double* out, int x_axis, int y_axis) {
    WritePlotRect(out, ImPlot::GetPlotSelection(x_axis, y_axis));
}

EXPORT void implotjs_cancel_plot_selection() {
    ImPlot::CancelPlotSelection();
}

EXPORT void implotjs_hide_next_item(int hidden, int cond) {
    ImPlot::HideNextItem(hidden != 0, cond);
}

EXPORT void implotjs_push_style_color(int idx, double r, double g, double b, double a) {
    ImPlot::PushStyleColor(idx, ColorFrom(r, g, b, a));
}

EXPORT void implotjs_pop_style_color(int count) {
    ImPlot::PopStyleColor(count);
}

EXPORT void implotjs_push_style_var_float(int idx, float value) {
    ImPlot::PushStyleVar(idx, value);
}

EXPORT void implotjs_push_style_var_int(int idx, int value) {
    ImPlot::PushStyleVar(idx, value);
}

EXPORT void implotjs_push_style_var_vec2(int idx, double x, double y) {
    ImPlot::PushStyleVar(idx, Vec2From(x, y));
}

EXPORT void implotjs_pop_style_var(int count) {
    ImPlot::PopStyleVar(count);
}

EXPORT void implotjs_set_next_line_style(double r, double g, double b, double a, float weight) {
    g_next_plot_style.spec.LineColor = ColorFrom(r, g, b, a);
    g_next_plot_style.spec.LineWeight = weight;
    g_next_plot_style.active = true;
}

EXPORT void implotjs_set_next_fill_style(double r, double g, double b, double a, float alpha_mod) {
    g_next_plot_style.spec.FillColor = ColorFrom(r, g, b, a);
    g_next_plot_style.spec.FillAlpha = alpha_mod;
    g_next_plot_style.active = true;
}

EXPORT void implotjs_set_next_marker_style(int marker, float size, double fill_r, double fill_g, double fill_b, double fill_a, float weight, double outline_r, double outline_g, double outline_b, double outline_a) {
    g_next_plot_style.spec.Marker = static_cast<ImPlotMarker>(marker);
    g_next_plot_style.spec.MarkerSize = size;
    g_next_plot_style.spec.MarkerFillColor = ColorFrom(fill_r, fill_g, fill_b, fill_a);
    g_next_plot_style.spec.LineWeight = weight;
    g_next_plot_style.spec.MarkerLineColor = ColorFrom(outline_r, outline_g, outline_b, outline_a);
    g_next_plot_style.active = true;
}

EXPORT void implotjs_set_next_error_bar_style(double r, double g, double b, double a, float size, float weight) {
    g_next_plot_style.spec.LineColor = ColorFrom(r, g, b, a);
    g_next_plot_style.spec.Size = size;
    g_next_plot_style.spec.LineWeight = weight;
    g_next_plot_style.active = true;
}

EXPORT void implotjs_get_last_item_color(double* out) {
    WriteVec4(out, ImPlot::GetLastItemColor());
}

EXPORT const char* implotjs_get_style_color_name(int idx) {
    return ImPlot::GetStyleColorName(static_cast<ImPlotCol>(idx));
}

EXPORT const char* implotjs_get_marker_name(int idx) {
    return ImPlot::GetMarkerName(static_cast<ImPlotMarker>(idx));
}

EXPORT int implotjs_next_marker() {
    return static_cast<int>(ImPlot::NextMarker());
}

EXPORT void implotjs_get_style(double* out) {
    const ImPlotStyle& style = ImPlot::GetStyle();
    int i = 0;
    out[i++] = style.PlotDefaultSize.x;
    out[i++] = style.PlotDefaultSize.y;
    out[i++] = style.PlotMinSize.x;
    out[i++] = style.PlotMinSize.y;
    out[i++] = style.PlotBorderSize;
    out[i++] = style.MinorAlpha;
    out[i++] = style.MajorTickLen.x;
    out[i++] = style.MajorTickLen.y;
    out[i++] = style.MinorTickLen.x;
    out[i++] = style.MinorTickLen.y;
    out[i++] = style.MajorTickSize.x;
    out[i++] = style.MajorTickSize.y;
    out[i++] = style.MinorTickSize.x;
    out[i++] = style.MinorTickSize.y;
    out[i++] = style.MajorGridSize.x;
    out[i++] = style.MajorGridSize.y;
    out[i++] = style.MinorGridSize.x;
    out[i++] = style.MinorGridSize.y;
    out[i++] = style.PlotPadding.x;
    out[i++] = style.PlotPadding.y;
    out[i++] = style.LabelPadding.x;
    out[i++] = style.LabelPadding.y;
    out[i++] = style.LegendPadding.x;
    out[i++] = style.LegendPadding.y;
    out[i++] = style.LegendInnerPadding.x;
    out[i++] = style.LegendInnerPadding.y;
    out[i++] = style.LegendSpacing.x;
    out[i++] = style.LegendSpacing.y;
    out[i++] = style.MousePosPadding.x;
    out[i++] = style.MousePosPadding.y;
    out[i++] = style.AnnotationPadding.x;
    out[i++] = style.AnnotationPadding.y;
    out[i++] = style.FitPadding.x;
    out[i++] = style.FitPadding.y;
    out[i++] = style.DigitalPadding;
    out[i++] = style.DigitalSpacing;
    for (int c = 0; c < ImPlotCol_COUNT; ++c) {
        out[i++] = style.Colors[c].x;
        out[i++] = style.Colors[c].y;
        out[i++] = style.Colors[c].z;
        out[i++] = style.Colors[c].w;
    }
    out[i++] = static_cast<double>(style.Colormap);
    out[i++] = style.UseLocalTime ? 1.0 : 0.0;
    out[i++] = style.UseISO8601 ? 1.0 : 0.0;
    out[i++] = style.Use24HourClock ? 1.0 : 0.0;
}

EXPORT void implotjs_style_colors(int theme) {
    switch (theme) {
        case 1: ImPlot::StyleColorsClassic(); break;
        case 2: ImPlot::StyleColorsDark(); break;
        case 3: ImPlot::StyleColorsLight(); break;
        default: ImPlot::StyleColorsAuto(); break;
    }
}

EXPORT int implotjs_add_colormap_rgba(const char* name, const float* rgba, int size, int qual) {
    std::vector<ImVec4> colors;
    colors.reserve(size);
    for (int i = 0; i < size; ++i) {
        const int base = i * 4;
        colors.emplace_back(rgba[base], rgba[base + 1], rgba[base + 2], rgba[base + 3]);
    }
    return ImPlot::AddColormap(name, colors.data(), size, qual != 0);
}

EXPORT int implotjs_get_colormap_count() {
    return ImPlot::GetColormapCount();
}

EXPORT const char* implotjs_get_colormap_name(int cmap) {
    return ImPlot::GetColormapName(cmap);
}

EXPORT int implotjs_get_colormap_index(const char* name) {
    return ImPlot::GetColormapIndex(name);
}

EXPORT int implotjs_get_colormap_size(int cmap) {
    return ImPlot::GetColormapSize(cmap);
}

EXPORT void implotjs_get_colormap_color(int idx, int cmap, double* out) {
    WriteVec4(out, ImPlot::GetColormapColor(idx, cmap));
}

EXPORT void implotjs_next_colormap_color(double* out) {
    WriteVec4(out, ImPlot::NextColormapColor());
}

EXPORT void implotjs_bust_color_cache(const char* plot_title_id) {
    ImPlot::BustColorCache(plot_title_id);
}

EXPORT void implotjs_push_colormap_index(int cmap) {
    ImPlot::PushColormap(cmap);
}

EXPORT void implotjs_push_colormap_name(const char* name) {
    ImPlot::PushColormap(name);
}

EXPORT void implotjs_pop_colormap(int count) {
    ImPlot::PopColormap(count);
}

EXPORT void implotjs_sample_colormap(float t, int cmap, double* out) {
    WriteVec4(out, ImPlot::SampleColormap(t, cmap));
}

EXPORT void implotjs_colormap_scale(const char* label, double scale_min, double scale_max, double width, double height, const char* format, int flags, int cmap) {
    ImPlot::ColormapScale(label, scale_min, scale_max, Vec2From(width, height), format, flags, cmap);
}

EXPORT int implotjs_colormap_slider(const char* label, float* t, double* out, const char* format, int cmap) {
    ImVec4 color;
    const bool changed = ImPlot::ColormapSlider(label, t, out != nullptr ? &color : nullptr, format, cmap);
    if (out != nullptr) {
        WriteVec4(out, color);
    }
    return changed ? 1 : 0;
}

EXPORT int implotjs_colormap_button(const char* label, double width, double height, int cmap) {
    return ImPlot::ColormapButton(label, Vec2From(width, height), cmap) ? 1 : 0;
}

EXPORT void implotjs_map_input_default() {
    ImPlot::MapInputDefault();
}

EXPORT void implotjs_map_input_reverse() {
    ImPlot::MapInputReverse();
}

EXPORT void implotjs_show_style_editor() {
    ImPlot::ShowStyleEditor();
}

EXPORT int implotjs_show_style_selector(const char* label) {
    return ImPlot::ShowStyleSelector(label) ? 1 : 0;
}

EXPORT int implotjs_show_colormap_selector(const char* label) {
    return ImPlot::ShowColormapSelector(label) ? 1 : 0;
}

EXPORT int implotjs_show_input_map_selector(const char* label) {
    return ImPlot::ShowInputMapSelector(label) ? 1 : 0;
}

EXPORT void implotjs_show_user_guide() {
    ImPlot::ShowUserGuide();
}

EXPORT void implotjs_show_metrics_window() {
    ImPlot::ShowMetricsWindow();
}
