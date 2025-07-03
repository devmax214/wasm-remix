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

#[plugin_fn]
pub fn scrape_website(input: String) -> FnResult<String> {
    let input: serde_json::Value = serde_json::from_str(&input)?;
    let url = input["url"].as_str().unwrap_or("");
    
    if url.is_empty() {
        return Err(Error::msg("URL is required").into());
    }
    
    // Fetch the URL using Extism's HTTP capabilities
    let request = HttpRequest::new(url)
        .with_header("User-Agent", "Mozilla/5.0 (compatible; ExtismWasmBot/1.0)")
        .with_header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
        .with_header("Accept-Language", "en-US,en;q=0.5")
        .with_header("Accept-Encoding", "gzip, deflate")
        .with_header("Connection", "keep-alive");
    
    let response = request.get()?;
    
    if response.status != 200 {
        return Err(Error::msg(format!("HTTP request failed with status: {}", response.status)).into());
    }
    
    let html_content = response.text()?;
    
    // Process the HTML content
    let title = extract_title(&html_content);
    let links = extract_links(&html_content);
    let text_content = extract_text_content(&html_content);
    let meta_tags = extract_meta_tags(&html_content);
    
    Ok(serde_json::json!({
        "success": true,
        "url": url,
        "status": response.status,
        "title": title,
        "content_length": html_content.len(),
        "links": links,
        "text_content": text_content,
        "meta_tags": meta_tags,
        "word_count": text_content.split_whitespace().count()
    }).to_string())
}

fn extract_title(html: &str) -> String {
    // Simple title extraction - look for <title> tag
    if let Some(start) = html.find("<title>") {
        if let Some(end) = html.find("</title>") {
            if end > start {
                return html[start + 7..end].trim().to_string();
            }
        }
    }
    "No title found".to_string()
}

fn extract_links(html: &str) -> Vec<String> {
    let mut links = Vec::new();
    let mut start = 0;
    
    while let Some(link_start) = html[start..].find("href=\"") {
        let full_start = start + link_start + 6;
        if let Some(link_end) = html[full_start..].find("\"") {
            let link = html[full_start..full_start + link_end].to_string();
            if link.starts_with("http") {
                links.push(link);
            }
        }
        start = full_start;
    }
    
    links
}

fn extract_text_content(html: &str) -> String {
    // Simple text extraction - remove HTML tags
    let mut text = String::new();
    let mut in_tag = false;
    
    for ch in html.chars() {
        match ch {
            '<' => in_tag = true,
            '>' => in_tag = false,
            _ if !in_tag => text.push(ch),
            _ => {}
        }
    }
    
    // Clean up whitespace
    text.lines()
        .map(|line| line.trim())
        .filter(|line| !line.is_empty())
        .collect::<Vec<_>>()
        .join(" ")
}

fn extract_meta_tags(html: &str) -> std::collections::HashMap<String, String> {
    let mut meta_tags = std::collections::HashMap::new();
    let mut start = 0;
    
    while let Some(meta_start) = html[start..].find("<meta") {
        let full_start = start + meta_start;
        if let Some(meta_end) = html[full_start..].find(">") {
            let meta_tag = html[full_start..full_start + meta_end + 1].to_string();
            
            // Extract name and content attributes
            if let Some(name_start) = meta_tag.find("name=\"") {
                if let Some(name_end) = meta_tag[name_start + 6..].find("\"") {
                    let name = meta_tag[name_start + 6..name_start + 6 + name_end].to_string();
                    
                    if let Some(content_start) = meta_tag.find("content=\"") {
                        if let Some(content_end) = meta_tag[content_start + 9..].find("\"") {
                            let content = meta_tag[content_start + 9..content_start + 9 + content_end].to_string();
                            meta_tags.insert(name, content);
                        }
                    }
                }
            }
            
            start = full_start + meta_end + 1;
        } else {
            break;
        }
    }
    
    meta_tags
} 