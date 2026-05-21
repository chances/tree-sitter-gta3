use zed_extension_api as zed;

struct GtaSblExtension;

impl zed::Extension for GtaSblExtension {
    fn new() -> Self {
        Self
    }
}

zed::register_extension!(GtaSblExtension);
