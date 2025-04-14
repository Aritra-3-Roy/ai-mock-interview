"use server";

import {auth, db} from "@/firebase/admin";
import {cookies} from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const {uid, name, email} = params;

    try{
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return {
                success: false,
                message: 'User already exists. Please sign in.',
            }
        }

        await db.collection('users').doc(uid).set({
            name: name,
            email: email,
        })

        return{
            success: true,
            message: 'Account created successfully. Please Sign In.',
        }
    }
    catch(e:any){
        console.error("Error creating user ",e);

        if(e.code === 'auth/email-already-exists'){
            return {
                success: false,
                message: 'This email is already in use',
            }
        }

        return {
            success: false,
            message: 'Failed to create an account',
        }
    }
}

export async function signIn(params: { email: string; idToken: Promise<string> }) {
    const {email,idToken} = params;

    try{
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord){
            return {
                success: false,
                message: 'User does not exist. Create an account instead.',
            }
        }
        await setSessionCookie(idToken);
    }
    catch(e){
        console.error(e);

        return {
            success: false,
            message: 'Failed to log in an account.',
        }
    }
}

export async function setSessionCookie(idToken: Promise<string>) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(await idToken,{
        expiresIn: ONE_WEEK * 1000,
    })

    cookieStore.set('session',sessionCookie,{
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV==='production',
        path: '/',
        sameSite: 'lax',
    })
}

export async function getCurrentUser() {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) {
        return null;
    }
    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie,true);

        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if(!userRecord){
            return null;
        }
        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User
    }
    catch(e:any){
        console.error(e);
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}