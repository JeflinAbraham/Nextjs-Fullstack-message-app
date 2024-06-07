import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

export const authOptions: NextAuthOptions = {

    //refer nextAuth docs.
    providers: [
        CredentialsProvider({
            name: 'Credentials',

            // The credentials object is used to hold the user's authentication credentials, which in this case are the email and password fields.
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'Email' },
                password: { label: 'Password', type: 'password', placeholder: 'Password' },
            },

            /*
            one inconsistency:
            credentials.identifier to get the email.
            credentials.password to get the password.
            */



            // nextAuth ko pta nhi authorize kese kre when u do the authorization using credentials, u hv to design a custom method.
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                // sign-in
                try {
                    const user = await User.findOne({ email: credentials.identifier });
                    if (!user) {
                        throw new Error('No user found with this email');
                    }

                    // user can log in only if his account is verified
                    if (!user.isVerified) {
                        throw new Error('Please verify your account before logging in');
                    }


                    // when the user exist and is verified.
                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if (isPasswordCorrect) {
                        return user;
                    }
                    else {
                        throw new Error('Incorrect password');
                    }
                }
                catch (err: any) {
                    throw new Error(err);
                }
            },
        }),
    ],


    callbacks: {
        /*
        strategy used:
        -> jwt callback contains {token, user}.
        -> this token has limited info such as the user's id.
        -> we can use this user (which is a User document) to add more details to this token.
        -> the session callback contains {session(it contains a user property), token}.
        -> we can shift all the token details to the session.
        -> now we can access the user info via jwt/session both.
        */
        async jwt({ token, user }) {
            if (user) {
                // the user object that NextAuth.js expects might not have properties like _id, isVerified. 
                // you may need to create a custom type definition file (next-auth.d.ts) to extend the default types provided by NextAuth.js.

                token._id = user._id?.toString(); // Convert ObjectId to string
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
    },


    
    // The session option in the NextAuth.js configuration is used to specify how the user session should be managed. NextAuth.js will store the session information in a signed JWT token.
    session: {
        strategy: 'jwt',
    },

    //  It is used to sign the JWT tokens that are used to store user session information    
    secret: process.env.NEXTAUTH_URL,



    /*
    The default pages used by NextAuth.js if no custom pages are specified in the pages option are:
    signIn: /api/auth/signin
    signOut: /api/auth/signout
    error: /api/auth/error
    verifyRequest: /api/auth/verify-request
    newUser: /api/auth/new-user
    */

    // This allows you to have a custom sign-in page in your Next.js application, rather than using the default sign-in page provided by NextAuth.js.
    pages: {
        signIn: '/sign-in',
    },
};