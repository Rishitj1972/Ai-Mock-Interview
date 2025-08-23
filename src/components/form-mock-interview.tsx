import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {FormProvider, useForm} from "react-hook-form";


import type { Interview } from "@/types";
import CustomBreadCrumb from "./custom-bread-crumb";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import Headings from "./headings";
import { Loader, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface FormMockInterviewProps {
    initialData: Interview | null; // initial data for the form from the parent component which is the create-edit-page which supplies the interview data
}

// Define the form schema using Zod
const formSchema = z.object({
    
    position: z.string()
    .min(1, "Position is required")
    .max(100, "Position must be at most 100 characters or less"),
    
    description: z.string().min(10, "Description is required"),
    
    experience: z.coerce.number().min(0, "Experience must be at least 0 years"),
    
    techStack: z.string().min(1, "Tech Stack is required")
});

type FormData = z.infer<typeof formSchema>; // Infer means to extract the form data type from the schema

const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema) as any, 
        defaultValues: initialData || {
            position: "",
            description: "",
            experience: 0,
            techStack: ""
        },
    });

    const { isValid, isSubmitting } = form.formState; // Destructure form state
    const [loading, setLoading] = useState(false); // Loading state for form submission
    const navigate = useNavigate(); // Navigation hook
    const { userId } = useAuth();  // User ID from authentication

    const title = initialData?.position ? initialData?.position : "Create a new Mock Interview"; // Form title based on create or edit mode

    const breadCrumbPage = initialData?.position ? "Edit" : "Create"; // Breadcrumb page title based on create or edit mode

    const actions = initialData?.position ? "Save changes" : "Create"; // Button text based on create or edit mode
    
    const toastMessage = initialData 
    ? {title: "Updated..!",description: "Changes saved successfully.."}
    : {title: "Created..!",description: "New mock interview created..!"};


    const onSubmit = async (data: FormData) => {
        try {
            console.log(data);
            setLoading(true);
        } catch (error) {
            console.log(error);
            toast.error("Error..", {
                description: "Something went wrong..!"
            })
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(initialData) {
            form.reset({
                position: initialData.position,
                description: initialData.description,
                experience: Number(initialData.experience) || 0,
                techStack: initialData.techStack
            })
        }
    },[initialData, form])
  
  return (<div className="w-full flex-col space-y-4">
    <CustomBreadCrumb
        breadCrumbPage={breadCrumbPage} // Breadcrumb page title
        breadCrumbItems={[{link:"/generate", label:"Mock Interview"}]}
    />
    <div className="mt-4 flex items-center justify-between w-full">
    <Headings
        title={title} isSubheading
    />
    {initialData && (
        <Button
        size = {"icon"}
        variant={"ghost"}
        >
            <Trash2 className="min-w-4 min-h-4 text-red-500"/>
        </Button>
    )}
    </div>
    <Separator className="my-4"/>
    <div className="my-6"></div>

    <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-8 rounded-lg flex flex-col gap-6 shadow-md"> 
            
            {/* Position Field */}
            <FormField
            control={form.control}
            name="position"
            render={({field})=>(
                <FormItem className="w-full">
                    <div className="w-full flex items-center justify-between">
                        <FormLabel>Job Role</FormLabel>
                        <FormMessage className="text-sm"/>
                    </div>
                    <FormControl>
                        <Input
                            {...field}
                            disabled={loading}
                            placeholder="eg:- full stack developer"
                            className="h-12"
                        />
                    </FormControl>
                </FormItem>
            )}
            />

            {/* description */}
            <FormField
            control={form.control}
            name="description"
            render={({field})=>(
                <FormItem className="w-full space-y-4">
                    <div className="w-full flex items-center justify-between">
                        <FormLabel>Job Description</FormLabel>
                        <FormMessage className="text-sm"/>
                    </div>
                    <FormControl>
                        <Textarea
                            disabled={loading}
                            placeholder="eg:- describe the job role"
                            className="h-12"
                            {...field}
                        />
                    </FormControl>
                </FormItem>
            )}
            />

            {/* experience */}
            <FormField
            control={form.control}
            name="experience"
            render={({field})=>(
                <FormItem className="w-full space-y-4">
                    <div className="w-full flex items-center justify-between">
                        <FormLabel>Years of Experience</FormLabel>
                        <FormMessage className="text-sm"/>
                    </div>
                    <FormControl>
                        <Input
                            type="number"
                            disabled={loading}
                            placeholder="eg:- 5 years in number"
                            className="h-12"
                            {...field}
                        />
                    </FormControl>
                </FormItem>
            )}
            />

            {/* tech stacks */}
            <FormField
            control={form.control}
            name="techStack"
            render={({field})=>(
                <FormItem className="w-full space-y-4">
                    <div className="w-full flex items-center justify-between">
                        <FormLabel>Tech Stacks</FormLabel>
                        <FormMessage className="text-sm"/>
                    </div>
                    <FormControl>
                        <Textarea
                            disabled={loading}
                            placeholder="eg:- React,Node.js etc."
                            className="h-12"
                            {...field}
                        />
                    </FormControl>
                </FormItem>
            )}
            />
            <div className="w-full flex items-center justify-end gap-6">
                <Button
                    type="reset"
                    size={"sm"}
                    variant={"outline"}
                    disabled={isSubmitting || loading}
                >
                    Reset
                </Button>
                <Button
                    type="submit"
                    size={"sm"}
                    disabled={isSubmitting || loading || !isValid}
                >
                    {loading ? ( <Loader className="text-gray-50 animate-spin" /> ) : ( actions )}
                </Button>
            </div>
        </form>
    </FormProvider>
  </div>
  );
}

export default FormMockInterview