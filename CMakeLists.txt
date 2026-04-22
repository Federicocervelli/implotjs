cmake_minimum_required(VERSION 3.20)

project(implotjs LANGUAGES CXX)

if (NOT EMSCRIPTEN)
    message(FATAL_ERROR "implotjs currently targets Emscripten builds only. Use emcmake cmake -S . -B build/emscripten.")
endif()

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

add_executable(implotjs
    src/native/main.cpp
    vendor/imgui/imgui.cpp
    vendor/imgui/imgui_draw.cpp
    vendor/imgui/imgui_tables.cpp
    vendor/imgui/imgui_widgets.cpp
    vendor/imgui/backends/imgui_impl_opengl3.cpp
    vendor/imgui/backends/imgui_impl_sdl2.cpp
    vendor/implot/implot.cpp
    vendor/implot/implot_items.cpp
)

target_include_directories(implotjs PRIVATE
    vendor/imgui
    vendor/imgui/backends
    vendor/implot
)

target_compile_definitions(implotjs PRIVATE
    IMGUI_DISABLE_FILE_FUNCTIONS
    IMGUI_DISABLE_OBSOLETE_FUNCTIONS
    IMGUI_DISABLE_OBSOLETE_KEYIO
    IMGUI_IMPL_OPENGL_ES2
    IMPLOT_DISABLE_OBSOLETE_FUNCTIONS
    IMPLOT_DISABLE_OBSOLETE_WARNINGS
)

target_compile_options(implotjs PRIVATE
    -Wall
    -Wextra
    -Wpedantic
    -sUSE_SDL=2
    -Oz
    -flto=full
    -fno-exceptions
    -fno-rtti
    -ffunction-sections
    -fdata-sections
    -fvisibility=hidden
    -fvisibility-inlines-hidden
)

target_link_options(implotjs PRIVATE
    -sUSE_SDL=2
    -sWASM=1
    -sALLOW_MEMORY_GROWTH=1
    -sASSERTIONS=0
    -sDISABLE_DEPRECATED_FIND_EVENT_TARGET_BEHAVIOR=0
    -sNO_EXIT_RUNTIME=1
    -sNO_FILESYSTEM=1
    -sMODULARIZE=1
    -sEXPORT_ES6=1
    -sEXPORT_NAME=ImPlotJSModule
    -sEXPORTED_FUNCTIONS=['_main','_malloc','_free']
    -sEXPORTED_RUNTIME_METHODS=['HEAPU8','HEAPU32','HEAPF32','HEAPF64']
    -Oz
    -flto=full
    -Wl,--gc-sections
    -sMALLOC=emmalloc
    -sENVIRONMENT=web
    -sDYNAMIC_EXECUTION=0
    -sSUPPORT_LONGJMP=0
    -sWASM_BIGINT=1
    -Wl,-Map,${CMAKE_BINARY_DIR}/link.map
)

set_target_properties(implotjs PROPERTIES
    OUTPUT_NAME "implotjs"
    SUFFIX ".js"
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/dist"
)
