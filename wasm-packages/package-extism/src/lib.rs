use extism_pdk::*;

#[plugin_fn]
pub fn greet(input: String) -> FnResult<String> {
    let input: serde_json::Value = serde_json::from_str(&input)?;
    let name = input["name"].as_str().unwrap_or("World");
    Ok(format!("Hello, {}! Welcome to Extism!", name))
}

#[plugin_fn]
pub fn calculate(input: String) -> FnResult<String> {
    let input: serde_json::Value = serde_json::from_str(&input)?;
    let operation = input["operation"].as_str().unwrap_or("add");
    let a = input["a"].as_f64().unwrap_or(0.0);
    let b = input["b"].as_f64().unwrap_or(0.0);
    
    let result = match operation {
        "add" => a + b,
        "subtract" => a - b,
        "multiply" => a * b,
        "divide" => {
            if b == 0.0 {
                return Err(Error::msg("Division by zero").into());
            }
            a / b
        }
        _ => return Err(Error::msg("Unknown operation").into()),
    };
    
    Ok(serde_json::json!({
        "result": result,
        "operation": operation,
        "a": a,
        "b": b
    }).to_string())
}

#[plugin_fn]
pub fn process_text(input: String) -> FnResult<String> {
    let input: serde_json::Value = serde_json::from_str(&input)?;
    let text = input["text"].as_str().unwrap_or("");
    
    // Simple text processing: uppercase and reverse
    let processed = text.to_uppercase().chars().rev().collect::<String>();
    
    Ok(serde_json::json!({
        "original": text,
        "processed": processed,
        "length": text.len()
    }).to_string())
} 