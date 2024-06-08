'use client';

import { useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';


import Link from 'next/link';
import { ApiResponse } from '@/types/ApiResponse';
import { useRouter } from 'next/navigation';



// shadcn docs for form.
// zodResolver for integrating Zod with React Hook Form.
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signUpSchema } from '@/schemas/signupSchema';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';


import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Loader2 } from 'lucide-react';



export default function SignUpForm() {

    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    // loading states
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    /*
    debouncing:
    The useDebounceValue takes two parameters: the value to be debounced (in this case, the username state variable) and the debounce delay (300 milliseconds). debouncedUsername is set/updated only after the user has stopped typing for the specified debounce delay (300 milliseconds)
    */
    const debouncedUsername = useDebounceValue(username, 300);
    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
                    console.log(response);

                    // in axios, use response.data to access the json response returned by the server.
                    if (response) setUsernameMessage(response.data.message);
                }
                catch (error: any) {
                    setUsernameMessage(error.response.data.message);
                }
                finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();

    }, [debouncedUsername]);






    // shadcn docs for toast
    const { toast } = useToast();

    const router = useRouter();

    // shadcn docs for form
    const form = useForm<z.infer<typeof signUpSchema>>({
        // resolver: it is an option to integrate a validation library with react-hook-form.
        // zodResolver: integrating zod to react-hook-form.
        resolver: zodResolver(signUpSchema),

        // initializes the form fields with names (username, email, password) to empty strings.
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });


    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/sign-up', data);
            // shadcn docs for toast
            toast({
                title: 'Success',
                description: response.data.message,
            });
            router.replace(`/verify/${username}`);
        }
        catch (error: any) {
            toast({
                title: 'Sign Up Failed',
                description: error.response.data.message,
                variant: 'destructive',
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join True Feedback
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>


                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    {/* we need the value of input field to be stored in the username state for debouncing */}
                                    <Input {...field}
                                        onChange={(e) => {
                                            // // Ensure internal form state is updated.
                                            field.onChange(e);

                                            // Custom handler logic
                                            setUsername(e.target.value);
                                        }}
                                    />
                                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                                    {!isCheckingUsername && usernameMessage && (
                                        <p className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-500' : 'text-red-500'}`}
                                        >
                                            {usernameMessage}
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            // name="email": Specifies the name of the form field, matching the key in our form's default values.
                            name="email"
                            control={form.control}


                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>

                                    {/* 
                                    The field object provided by render includes various properties and methods such as value, onChange and onBlur.

                                    The value of the input field is tracked in the form state. When the user types into the input, the onChange handler of the field object updates the state.

                                    When the user submits the form or the input loses focus (triggering onBlur), React Hook Form validates the input value against the Zod schema. If validation fails, the error message is displayed via the FormMessage component.
                                    */}
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <Input {...field} type='password' />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full' disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
