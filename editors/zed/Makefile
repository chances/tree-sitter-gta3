.PHONY: all
all: validate
	cargo build --target wasm32-wasip2 --release

.PHONY: validate
validate:
	@test -f extension.toml
	@test -d languages
	@echo "Validated Zed extension sources."
	@echo "Build/package this extension with Zed or the Zed extension publishing infrastructure."
