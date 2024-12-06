'use client';
import React from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Image from 'next/image';
import Link from 'next/link';

type Type = 'sign-in' | 'sign-up';

type AuthFormPropsType = {
    type: Type;
};
const AuthFormSchema = (formType: Type) => {
    return z.object({
        email: z.string().email(),
        fullName:
            formType === 'sign-up'
                ? z.string().min(2).max(50)
                : z.string().optional(),
    });
};

const AuthForm = ({ type }: AuthFormPropsType) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(true);
    // 1. Define your form.
    const formSchema = AuthFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            email: '',
        },
    });

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    };
    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="auth-form"
                >
                    <h1 className="form-title"> {type}</h1>
                    {type === 'sign-up' && (
                        <>
                            username
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="shad-form-item">
                                            <FormLabel className="shad-form-label">
                                                full name
                                            </FormLabel>
                                            <Input
                                                placeholder="enter your full name"
                                                {...field}
                                                className="shad-input"
                                            />
                                        </div>
                                        <FormControl></FormControl>
                                        <FormMessage className="shad-form-message" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="shad-form-item">
                                            <FormLabel className="shad-form-label">
                                                email
                                            </FormLabel>
                                            <Input
                                                placeholder="enter your email"
                                                {...field}
                                                className="shad-input"
                                            />
                                        </div>
                                        <FormControl></FormControl>
                                        <FormMessage className="shad-form-message" />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    <Button
                        type="submit"
                        className="form-submit-button"
                        disabled={isLoading}
                    >
                        {type}
                        {isLoading && (
                            <Image
                                src={'assets/icons/loader.svg'}
                                alt="loader"
                                width={24}
                                height={24}
                                className="ml-2 animate-spin"
                            />
                        )}
                    </Button>

                    {errorMessage && <p className="error-message">*</p>}
                    <div className="body-2 flex justify-center">
                        <p className="text-light-100">
                            {type === 'sign-in'
                                ? `Don't have an Account?`
                                : `Already have an account?`}
                        </p>
                        <Link
                            href={type === 'sign-in' ? 'sign-up' : 'sign-in'}
                            className="ml-1 font-medium text-brand"
                        >
                            {type === 'sign-in' ? 'sign-up' : 'sign-in'}
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    );
};

export default AuthForm;
