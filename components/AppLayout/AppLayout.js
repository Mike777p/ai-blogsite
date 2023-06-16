export const AppLayout = ({ children }) => {
    return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen" > 
        <div className="flex flex-col text-white overflow-hidden">
            <div className="bg-slate-800">
            <div>Logo</div>
            <div>CTA button</div>
            <div>Tokens</div>

            </div>
            <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
                List of posts
            </div>
            <div className="bg-cyan-800">
                User information - logout button
            </div>
        </div>
        <div className="">{children}</div>
    </div>
    )
};