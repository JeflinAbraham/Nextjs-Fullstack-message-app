// this is a typeScript declaration file that extends the types provided by the next-auth package.


import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    // By defining this custom Session interface, you can ensure that the Session object in your application includes the additional user properties you need (such as _id, isVerified...), in addition to the default properties provided by NextAuth.js.
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        } & DefaultSession['user'];
    }

    // The purpose of this User interface is to extend the default user object provided by NextAuth.js to include additional user-related properties
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }

}
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}