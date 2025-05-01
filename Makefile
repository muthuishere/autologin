DIST_FOLDER = dist
ZIP_NAME = autologin-mv3.zip

# Default target
all: clean build zip

# Clean dist folder
clean:
	rm -rf $(DIST_FOLDER)/*

# Run npm build
build:
	bun run build

# Create zip from dist folder
zip:
	cd $(DIST_FOLDER) && zip -r ../releases/$(ZIP_NAME) .
