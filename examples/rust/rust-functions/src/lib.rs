use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fib(n: i32) -> i32 {
    if n < 2 {
        return n;
    }

    return fib(n - 1) + fib( n - 2);
}
