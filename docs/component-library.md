# StyleAI Component Library

## Overview

StyleAI uses a comprehensive component library based on shadcn/ui with custom neumorphic design elements. This document provides documentation for all reusable UI components.

## Design System

### Colors

The application uses a custom grayscale palette for the neumorphic design:

```typescript
// tailwind.config.ts
const colors = {
  gray: {
    50: '#FFFFFF',
    90: '#F0F0F3',
    100: '#E6E6E9',
    200: '#D1D1D6',
    300: '#B5B5BD',
    400: '#92929D',
    500: '#696974',
    600: '#4B4B53',
    700: '#2E2E33',
    800: '#1A1A1F',
    900: '#09090B',
  },
  primary: {
    DEFAULT: '#3B82F6',
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  // Other colors...
};
```

### Typography

```typescript
// tailwind.config.ts
const typography = {
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
    heading: ['Poppins', 'sans-serif'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
  },
};
```

### Shadows

Custom neumorphic shadows:

```typescript
// tailwind.config.ts
const shadows = {
  neumorphic: '10px 10px 20px #d1d1d6, -10px -10px 20px #ffffff',
  'neumorphic-sm': '5px 5px 10px #d1d1d6, -5px -5px 10px #ffffff',
  'neumorphic-inset': 'inset 5px 5px 10px #d1d1d6, inset -5px -5px 10px #ffffff',
};
```

## Core Components

### Button

A versatile button component with multiple variants.

**Usage:**

```tsx
import { Button } from '@/components/ui/Button';

// Default button
<Button>Click me</Button>

// Primary button
<Button variant="primary">Primary</Button>

// Outline button
<Button variant="outline">Outline</Button>

// Ghost button
<Button variant="ghost">Ghost</Button>

// With icon
<Button>
  <PlusIcon className="mr-2 h-4 w-4" />
  Add Item
</Button>

// Disabled state
<Button disabled>Disabled</Button>

// Loading state
<Button isLoading>Loading</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'default' \| 'primary' \| 'outline' \| 'ghost' \| 'link' | 'default' | Button style variant |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| isLoading | boolean | false | Shows loading spinner |
| loadingText | string | undefined | Text to show when loading |
| leftIcon | ReactNode | undefined | Icon to show on the left |
| rightIcon | ReactNode | undefined | Icon to show on the right |

### Card

Neumorphic card component for content containers.

**Usage:**

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

**Props:**

| Component | Props | Description |
|-----------|-------|-------------|
| Card | className, ...props | Main container |
| CardHeader | className, ...props | Card header section |
| CardTitle | className, ...props | Card title |
| CardDescription | className, ...props | Card description |
| CardContent | className, ...props | Card content section |
| CardFooter | className, ...props | Card footer section |

### Input

Text input component with various states.

**Usage:**

```tsx
import { Input } from '@/components/ui/Input';

// Basic input
<Input placeholder="Enter your name" />

// With label
<div className="space-y-2">
  <Label htmlFor="name">Name</Label>
  <Input id="name" placeholder="Enter your name" />
</div>

// Disabled state
<Input disabled placeholder="Disabled input" />

// Error state
<Input error="This field is required" placeholder="Error input" />

// With icon
<div className="relative">
  <Input placeholder="Search..." />
  <SearchIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
</div>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| error | string | undefined | Error message |
| type | string | 'text' | Input type |
| fullWidth | boolean | false | Takes full width |

### Select

Dropdown select component.

**Usage:**

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="tops">Tops</SelectItem>
    <SelectItem value="bottoms">Bottoms</SelectItem>
    <SelectItem value="shoes">Shoes</SelectItem>
    <SelectItem value="accessories">Accessories</SelectItem>
  </SelectContent>
</Select>
```

### Checkbox

Checkbox component for multiple selections.

**Usage:**

```tsx
import { Checkbox } from '@/components/ui/Checkbox';

// Basic checkbox
<Checkbox id="terms" />

// With label
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>

// Disabled state
<Checkbox id="disabled" disabled />

// Checked state
<Checkbox id="checked" checked />
```

### RadioGroup

Radio button group for single selections.

**Usage:**

```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';

<RadioGroup defaultValue="option-one">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label htmlFor="option-one">Option One</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label htmlFor="option-two">Option Two</Label>
  </div>
</RadioGroup>
```

### Switch

Toggle switch component.

**Usage:**

```tsx
import { Switch } from '@/components/ui/Switch';

// Basic switch
<Switch />

// With label
<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>

// Controlled
<Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
```

### Slider

Range slider component.

**Usage:**

```tsx
import { Slider } from '@/components/ui/Slider';

<Slider defaultValue={[50]} max={100} step={1} />
```

### Tabs

Tabbed interface component.

**Usage:**

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings</TabsContent>
  <TabsContent value="password">Password settings</TabsContent>
</Tabs>
```

### Dialog

Modal dialog component.

**Usage:**

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog Description</DialogDescription>
    </DialogHeader>
    <div>Dialog content goes here</div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Toast

Notification toast component.

**Usage:**

```tsx
import { useToast } from '@/hooks/useToast';

const { toast } = useToast();

// Show a toast
<Button
  onClick={() => {
    toast({
      title: 'Success',
      description: 'Your changes have been saved.',
      variant: 'success',
    });
  }}
>
  Show Toast
</Button>
```

## Form Components

### Form

Form component with validation.

**Usage:**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

// Define form schema
const formSchema = z.object({
  username: z.string().min(2).max(50),
});

// Form component
function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Layout Components

### Container

Container component for consistent page layouts.

**Usage:**

```tsx
import { Container } from '@/components/layout/Container';

<Container>
  <h1>Page Content</h1>
  <p>This content is centered and has a max width.</p>
</Container>
```

### Grid

Grid layout component.

**Usage:**

```tsx
import { Grid } from '@/components/layout/Grid';

<Grid columns={3} gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

### Flex

Flexbox layout component.

**Usage:**

```tsx
import { Flex } from '@/components/layout/Flex';

<Flex direction="row" justify="between" align="center">
  <div>Left</div>
  <div>Right</div>
</Flex>
```

## Feedback Components

### Skeleton

Loading skeleton component.

**Usage:**

```tsx
import { Skeleton } from '@/components/ui/Skeleton';

<Skeleton className="h-12 w-12 rounded-full" />
<Skeleton className="h-4 w-[250px]" />
<Skeleton className="h-4 w-[200px]" />
```

### Alert

Alert component for notifications.

**Usage:**

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { InfoIcon } from 'lucide-react';

<Alert>
  <InfoIcon className="h-4 w-4" />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>
    This is an informational alert.
  </AlertDescription>
</Alert>
```

### Progress

Progress indicator component.

**Usage:**

```tsx
import { Progress } from '@/components/ui/Progress';

<Progress value={60} />
```

## Navigation Components

### Navbar

Navigation bar component.

**Usage:**

```tsx
import { Navbar } from '@/components/navigation/Navbar';

<Navbar />
```

### Breadcrumb

Breadcrumb navigation component.

**Usage:**

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/Breadcrumb';

<Breadcrumb>
  <BreadcrumbItem>
    <BreadcrumbLink href="/">Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem>
    <BreadcrumbLink href="/wardrobe">Wardrobe</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem isCurrentPage>
    <BreadcrumbLink href="/wardrobe/add">Add Item</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>
```

## Specialized Components

### WardrobeItem

Component for displaying wardrobe items.

**Usage:**

```tsx
import { WardrobeItem } from '@/components/wardrobe/WardrobeItem';

<WardrobeItem item={wardrobeItem} />
```

### OutfitDisplay

Component for displaying outfits.

**Usage:**

```tsx
import { OutfitDisplay } from '@/components/outfit/OutfitDisplay';

<OutfitDisplay outfit={outfit} items={items} />
```

### ImageUpload

Component for uploading and previewing images.

**Usage:**

```tsx
import { ImageUpload } from '@/components/form/ImageUpload';

<ImageUpload
  value={imageUrl}
  onChange={setImageUrl}
  onUpload={handleUpload}
/>
```

## Animation Components

### Motion

Wrapper components for Framer Motion animations.

**Usage:**

```tsx
import { MotionDiv, MotionButton } from '@/components/ui/Motion';

// Animated div
<MotionDiv
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</MotionDiv>

// Animated button
<MotionButton
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Animated Button
</MotionButton>
```

### AnimatedList

Component for rendering animated lists.

**Usage:**

```tsx
import { AnimatedList } from '@/components/ui/AnimatedList';

<AnimatedList
  items={items}
  renderItem={(item) => <WardrobeItem key={item.id} item={item} />}
/>
```

## Accessibility

All components are built with accessibility in mind:

- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader support
- Color contrast compliance

## Best Practices

1. **Component Usage**
   - Use the appropriate component for the task
   - Avoid unnecessary nesting of components
   - Keep component props simple and focused

2. **Styling**
   - Use Tailwind classes for styling
   - Use the `cn` utility for conditional classes
   - Follow the neumorphic design guidelines

3. **Performance**
   - Memoize components when appropriate
   - Use proper key props for lists
   - Avoid unnecessary re-renders

4. **Accessibility**
   - Always include labels for form elements
   - Ensure proper keyboard navigation
   - Test with screen readers

## Creating New Components

When creating new components:

1. Follow the existing component structure
2. Include proper TypeScript types
3. Document the component with JSDoc comments
4. Add accessibility features
5. Test the component thoroughly

## Component Development Workflow

1. Identify the need for a new component
2. Design the component API (props, events, etc.)
3. Implement the component with TypeScript
4. Test the component for functionality and accessibility
5. Document the component
6. Add the component to the library
