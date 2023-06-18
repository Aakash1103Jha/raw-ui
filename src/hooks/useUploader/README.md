# useUploader Hook

A custom hook that returns an `Uploader` component, along with its helper functions that can be used outside the component as well. This is not a library or compiled code, but can directly be copied/downloaded and customized to suit your project needs, in your own folder structure.

> Make sure to get both `./src/hooks/useUploader` and `./src/assets/svg` folders.

## Usage

```typescript
import { useUploader } from "path/to/this/hook";
// other imports

const YourComponent = () => {
	const { Uploader } = useUploader();
	// other logic

	return <Uploader />;
};
```

```typescript
type UploaderPropTypes = ComponentPropsWithRef<"div"> & {
	addFromUrl?: boolean; // default - false
	uploaderType?: "classic" | "url";
	modalTitle?: string; // default - "Upload"
	fileListTitle?: string; // default - "Selected Files"
	uploadInstruction?: string; // default - "JPG, PNG or PDF - Max file size 2MB"
	allowedSizePerFile?: number; // default - 1MB
	allowedMimeTypes?: string[]; // default - ["image/png","image/jpg","image/jpeg","application/pdf"]
};
```

