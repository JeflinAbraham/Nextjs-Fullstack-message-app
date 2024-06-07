//from nextAuth docs (getting started page)
'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                Signed in as {session.user.email} 
                <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in 
            <br />
            <button className="bg-orange-600 p-2 rounded-xl m-2" onClick={() => signIn()}>Sign in</button>
        </>
    )
}