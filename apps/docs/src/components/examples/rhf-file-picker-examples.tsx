"use client";

import { Button, RHFFilePicker, RHFInputGroup } from "@hexpacket/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFFilePickerExample() {
  const methods = useForm({
    defaultValues: {
      basicFiles: []
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFFilePicker name="basicFiles" />
    </FormProvider>
  );
}

export function WithValidationExample() {
  const schema = z.object({
    validationImages: z
      .array(z.custom<File>())
      .min(1, "At least one image is required")
      .max(10, "Maximum 10 images allowed")
      .refine(
        (files) => files.every((file) => file.size <= 5000000),
        "Each file must be less than 5MB"
      )
      .refine(
        (files) =>
          files.every((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type)),
        "Only JPEG, PNG, and WebP images are allowed"
      )
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      validationImages: []
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert(`${data.validationImages.length} images uploaded! Check console for data.`);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup label="Product Images" required>
          <RHFFilePicker name="validationImages" accept="image/*" />
        </RHFInputGroup>
        <Button type="submit">Upload Images</Button>
      </form>
    </FormProvider>
  );
}

export function RemoveDuplicatesExample() {
  const methods = useForm({
    defaultValues: {
      uniqueDocuments: []
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFFilePicker name="uniqueDocuments" removeDuplicates accept=".pdf,.doc,.docx" />
    </FormProvider>
  );
}

export function KeepOldFilesExample() {
  const methods = useForm({
    defaultValues: {
      accumulatedFiles: []
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFFilePicker name="accumulatedFiles" keepOldFiles />
    </FormProvider>
  );
}

export function CustomRenderExample() {
  const methods = useForm({
    defaultValues: {
      customImages: []
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFFilePicker
        name="customImages"
        removeDuplicates={false}
        accept="image/*"
        render={({ dropzoneRef, dragging, loading, field: { value: files }, openFilePicker }) => (
          <div
            ref={dropzoneRef}
            className={`relative flex h-[500px] w-full flex-col rounded border-2 border-dashed ${loading ? "cursor-wait" : ""} ${dragging ? "border-blue-400" : "border-gray-300"}`}>
            {!!files?.length && (
              <div
                style={{ scrollbarWidth: "none" }}
                className="w-full flex-1 flex-col overflow-y-auto text-start grid grid-cols-3 gap-x-3 gap-y-3 p-2 pb-16 place-content-start">
                {files.map((file) => {
                  return (
                    <img
                      key={file.preview}
                      src={file.preview}
                      alt={file.name}
                      className="inline-block aspect-square w-full h-20 object-contain rounded border border-gray-300"
                    />
                  );
                })}
              </div>
            )}

            <div className="absolute left-0 right-0 border bg-white dark:bg-black p-1.5 bottom-0 flex flex-row gap-2">
              <Button variant="outlined" className="flex-1" onClick={() => openFilePicker()}>
                Select Images
              </Button>

              <Button className="flex-1" onClick={() => openFilePicker({ directory: true })}>
                Select Directory
              </Button>
            </div>

            {!loading && !files?.length && (
              <div className="flex flex-1 items-center justify-center">
                <span>Drop images here or click buttons below</span>
              </div>
            )}

            {loading && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                Loading...
              </div>
            )}
          </div>
        )}
      />
    </FormProvider>
  );
}

export function WithCallbacksExample() {
  const methods = useForm({
    defaultValues: {
      callbackFiles: []
    }
  });

  const handleChange = (files: any[], newFiles: any[]) => {
    console.log("All files:", files);
    console.log("New files:", newFiles);
    if (newFiles.length > 0) {
      alert(`${newFiles.length} new file(s) added. Total: ${files.length}`);
    }
  };

  const handleError = (error: Error) => {
    console.error("File picker error:", error);
    alert(`Error: ${error.message}`);
  };

  return (
    <FormProvider {...methods}>
      <RHFFilePicker name="callbackFiles" onChange={handleChange} onError={handleError} />
    </FormProvider>
  );
}

export function CompleteFormExample() {
  const schema = z.object({
    projectFiles: z
      .array(z.custom<File>())
      .min(1, "At least one file is required")
      .refine(
        (files) => files.every((file) => file.size <= 10000000),
        "Each file must be less than 10MB"
      ),
    screenshots: z
      .array(z.custom<File>())
      .min(3, "At least 3 screenshots are required")
      .max(10, "Maximum 10 screenshots allowed")
      .refine(
        (files) =>
          files.every((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type)),
        "Only JPEG, PNG, and WebP images are allowed"
      )
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      projectFiles: [],
      screenshots: []
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert(
      `Project submitted with ${data.projectFiles.length} files and ${data.screenshots.length} screenshots!`
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup label="Project Files" required>
          <RHFFilePicker name="projectFiles" removeDuplicates />
        </RHFInputGroup>

        <RHFInputGroup label="Screenshots" required>
          <RHFFilePicker name="screenshots" accept="image/*" removeDuplicates />
        </RHFInputGroup>

        <Button type="submit">Submit Project</Button>
      </form>
    </FormProvider>
  );
}
