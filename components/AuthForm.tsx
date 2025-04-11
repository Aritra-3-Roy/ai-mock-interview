"use client"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { Form } from "@/components/ui/form"
import Link from "next/link";
import {toast} from "sonner";
import FormField from "@/components/FormField";
import {useRouter} from "next/navigation";

const authFormSchema = (type : FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    })
}

const AuthForm = ({type} : {type :FormType}) => {

    const router = useRouter();
    const formSchema = authFormSchema(type)
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            if(type === "sign-in"){
                toast.success("Account created successfully. Please sign in.");
                router.push("/sign-in");
                console.log("SIGN-IN ",values);
            }
            else{
                toast.success("Signed In successfully.");
                router.push("/");
                console.log("SIGN-UP ", values);
            }
        }catch(error){
            console.log(error);
            toast.error(`There is an error in the form! ${error}`);
        }
    }

    const isSignIn = type === "sign-in";

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className="text-primary-100">PrepWise</h2>
                </div>
                <h3>Practice for Job Interviews with AI</h3>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                    {!isSignIn && <FormField
                        control={form.control}
                        name="name"
                        label="Name"
                        placeholder="Enter your Name"
                        type="text"
                    />
                    }
                    <FormField
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="Enter your Email"
                        type="email"
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        label="Password"
                        placeholder="Enter your Password"
                        type="password"
                    />

                    <Button type="submit" className="btn">{isSignIn ? 'Sign In' : 'Create and Account'}</Button>
                </form>
            </Form>

            <p className="text-center">
                {isSignIn ? 'No account yet?' : 'Already have an account?'}
                <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
                    {!isSignIn ? 'Sign In' : 'Sign Up'}
                </Link>
            </p>
        </div>
        </div>
    )
}
export default AuthForm
