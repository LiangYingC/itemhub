// This file must be included before include of any Boost library.
// This will setup exception handling and fix some compile problems.
#pragma once

// Exceptions are disabled on Particle by default,
// but can be re-enabled (experimental) with
// #pragma GCC optimize "exceptions"
#if defined(CUSTOM_EXCEPTION_HANDLER) || !defined(__cpp_exceptions)

#define BOOST_NO_EXCEPTIONS
#define BOOST_EXCEPTION_DISABLE

#include "boost/throw_exception.hpp"

// By default, on exception from Boost, the system will reset.
// To override default exception handler, define CUSTOM_EXCEPTION_HANDLER
// before including this file and write your own handler.
// Example:
//
//  void boost::throw_exception(const std::exception& ex) {
//      // Log exception and reboot
//      Particle.publish("Error", ex.what(), PRIVATE);
//      System.reset();
//  }
//
#if !defined(CUSTOM_EXCEPTION_HANDLER)
inline void boost::throw_exception(const std::exception&) {
    System.reset();
}
#endif

#endif

// There are collisions between SPARK macros for pins
// and template type names in Boost.
// To preserve both, temporary undefine macros,
// pre-include affected Boost header files and put
// macros back.

#pragma push_macro("A0")
#pragma push_macro("A1")
#pragma push_macro("A2")
#pragma push_macro("A3")
#pragma push_macro("A4")
#pragma push_macro("A5")
#pragma push_macro("A6")
#pragma push_macro("A7")

#undef A0
#undef A1
#undef A2
#undef A3
#undef A4
#undef A5
#undef A6
#undef A7

#pragma push_macro("B0")
#pragma push_macro("B1")
#pragma push_macro("B2")
#pragma push_macro("B3")
#pragma push_macro("B4")
#pragma push_macro("B5")

#undef B0
#undef B1
#undef B2
#undef B3
#undef B4
#undef B5

#pragma push_macro("C0")
#pragma push_macro("C1")
#pragma push_macro("C2")
#pragma push_macro("C3")
#pragma push_macro("C4")
#pragma push_macro("C5")

#undef C0
#undef C1
#undef C2
#undef C3
#undef C4
#undef C5

#pragma push_macro("D0")
#pragma push_macro("D1")
#pragma push_macro("D2")
#pragma push_macro("D3")
#pragma push_macro("D4")
#pragma push_macro("D5")
#pragma push_macro("D6")
#pragma push_macro("D7")

#undef D0
#undef D1
#undef D2
#undef D3
#undef D4
#undef D5
#undef D6
#undef D7

#pragma push_macro("F")

#undef F

// Pre-include affected files

#include <boost/optional.hpp>
#include <boost/variant.hpp>
#include <boost/mp11.hpp>

// Restore macros

#pragma pop_macro("A0")
#pragma pop_macro("A1")
#pragma pop_macro("A2")
#pragma pop_macro("A3")
#pragma pop_macro("A4")
#pragma pop_macro("A5")
#pragma pop_macro("A6")
#pragma pop_macro("A7")

#pragma pop_macro("B0")
#pragma pop_macro("B1")
#pragma pop_macro("B2")
#pragma pop_macro("B3")
#pragma pop_macro("B4")
#pragma pop_macro("B5")

#pragma pop_macro("C0")
#pragma pop_macro("C1")
#pragma pop_macro("C2")
#pragma pop_macro("C3")
#pragma pop_macro("C4")
#pragma pop_macro("C5")

#pragma pop_macro("D0")
#pragma pop_macro("D1")
#pragma pop_macro("D2")
#pragma pop_macro("D3")
#pragma pop_macro("D4")
#pragma pop_macro("D5")
#pragma pop_macro("D6")
#pragma pop_macro("D7")

#pragma pop_macro("F")

