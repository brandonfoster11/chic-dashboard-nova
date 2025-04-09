import { z } from 'zod';

/**
 * Validates request data against a Zod schema
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns An object with success status and validated data or errors
 */
export function validateData<T extends z.ZodType>(schema: T, data: unknown) {
  try {
    // Validate the data against the schema
    const result = schema.safeParse(data);
    
    if (!result.success) {
      // Return validation errors
      return { 
        success: false, 
        errors: result.error.format(),
        message: 'Validation failed'
      };
    }
    
    // Return the validated data
    return { success: true, data: result.data };
  } catch (error) {
    // Handle unexpected errors
    return { 
      success: false, 
      message: 'Error validating data'
    };
  }
}

/**
 * Validates query parameters against a Zod schema
 * @param schema - The Zod schema to validate against
 * @param queryParams - The query parameters to validate
 * @returns An object with success status and validated data or errors
 */
export function validateQueryParams<T extends z.ZodType>(schema: T, queryParams: Record<string, string>) {
  try {
    // Validate the query parameters against the schema
    const result = schema.safeParse(queryParams);
    
    if (!result.success) {
      // Return validation errors
      return { 
        success: false, 
        errors: result.error.format(),
        message: 'Query validation failed'
      };
    }
    
    // Return the validated data
    return { success: true, data: result.data };
  } catch (error) {
    // Handle any unexpected errors
    return { 
      success: false, 
      message: 'Error validating query parameters'
    };
  }
}

/**
 * Helper function to parse and validate form data
 * @param formData - The FormData object to validate
 * @param schema - The Zod schema to validate against
 * @returns An object with success status and validated data or errors
 */
export function validateFormData<T extends z.ZodType>(schema: T, formData: FormData) {
  try {
    // Convert FormData to a plain object
    const data: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      // Handle arrays (multiple form fields with the same name)
      if (data[key]) {
        if (Array.isArray(data[key])) {
          (data[key] as unknown[]).push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    });
    
    // Validate the data against the schema
    return validateData(schema, data);
  } catch (error) {
    // Handle unexpected errors
    return { 
      success: false, 
      message: 'Error processing form data'
    };
  }
}
