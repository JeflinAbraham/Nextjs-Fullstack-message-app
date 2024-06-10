import dbConnect from '@/lib/dbConnect';
import User from '@/models/user.model';
import { z } from 'zod';


const UsernameQuerySchema = z.object({
    username: z
        .string()
        .min(3, "Username must be atleast 3 characters")
        .max(20, "Username must be no more than 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")
});



export async function GET(request: Request) {
    await dbConnect();

    try {
        // The new URL(request.url) creates a URL object that contains various properties of the incoming request url.
        // The searchParams property of this URL object contains the query parameters.
        const { searchParams } = new URL(request.url);
        const queryParams = {
            // searchParams.get('username') is used to retrieve the value of the 'username' query parameter from the searchParams object.
            username: searchParams.get('username'),
        };

        // to validate the queryParams object against the UsernameQuerySchema schema.
        const result = UsernameQuerySchema.safeParse(queryParams);
        
        // console log to know about the properties of result.
        // console.log(result);

        if (!result.success) {
            // console.log(result.error.format());
            // console.log(result.error.format().username);
            // console.log(result.error.format().username?._errors);
            
            const usernameErrors = result.error.format().username?._errors || [];
            console.log(usernameErrors);
            return Response.json(
              {
                success: false,
                message:
                  usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters',
              },
              { status: 400 }
            );
          }

        const { username } = result.data;
        const existingVerifiedUser = await User.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 200 }
            );
        }
        return Response.json(
            {
                /*
                we get this message if:
                1. the username doesn't exist in the databse
                2. the username exist in the database but is not verified. 
                */

                success: true,
                message: 'Username is unique',
            },
            { status: 200 }
        );
    }


    catch (error) {
        console.error('Error checking username:', error);
        return Response.json(
            {
                success: false,
                message: 'Error checking username',
            },
            { status: 500 }
        );
    }
}