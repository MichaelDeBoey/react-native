# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

include(${REACT_COMMON_DIR}/cmake-utils/react-native-flags.cmake)

file(GLOB react_nativemodule_dom_SRC CONFIGURE_DEPENDS *.cpp)
add_library(react_nativemodule_dom
        OBJECT
            ${react_nativemodule_dom_SRC}
            $<TARGET_OBJECTS:react_codegen_rncore>
)

target_include_directories(react_nativemodule_dom PUBLIC ${REACT_COMMON_DIR})

target_link_libraries(react_nativemodule_dom
        rrc_root
        react_codegen_rncore
        react_cxxreact
        react_renderer_dom
        react_renderer_uimanager
)
target_compile_reactnative_options(react_nativemodule_dom PRIVATE)
target_compile_options(react_nativemodule_dom PRIVATE -Wpedantic)
