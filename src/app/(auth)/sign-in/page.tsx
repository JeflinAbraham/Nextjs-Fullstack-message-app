"use client"
import { z } from "zod"
import { signInSchema } from "@/schemas/signinSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"


function page() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  const { toast } = useToast();
  const router = useRouter();

  /*
  nextAuth flow:
  when the user needs to sign in, he is redirected to '/sign-in'(custom sign-in page), which was provided in the pages option in options.ts
  The user fills in their credentials (email and password) and submits the form, onSubmit event handler is invoked.
  This handler calls the signIn function provided by NextAuth.js with the credentials as the authentication provider.
  signIn failure/ success is managed accordingly.

  */


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {

      // redirect: false, means the function won't automatically redirect upon successful sign-in.
      redirect: false,
      email: data.email,
      password: data.password,
    });
    console.log(result);
    if (result?.error) {
      //  If the sign-in attempt fails, the result object will contain an error property.
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }

    //  If the sign-in attempt is successful, the result object contains a url property. This property contains the URL where the user would have been redirected to automatically, but we manually redirect the user to '/dashboard' using next router.
    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">

        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Sign in to join
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        


        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} placeholder='Email' />
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
                  <Input {...field} type='password' placeholder='Password' />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full'>
              Sign in
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Don't have an accoount{' '}
            <Link href="/sign-up" className="text-blue-600 underline hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default page