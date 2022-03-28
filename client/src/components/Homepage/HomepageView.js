import WorkspaceForm from "./WorkspaceForm";
function HomepageView() {
    return (
        <div className="h-full align-middle">
            <div className="flex flex-row h-full px-20 py-10 2xl:py-20">
                <div className="w-1/3">
                    <span className="text-white 2xl:text-3xl">
                        <p className="text-2xl 2xl:text-6xl">Welcome,</p>
                        <p>Start your RENTD experience now!</p>
                    </span>
                    <div className="pl-5 2xl:pr-20 pt-5">
                        <WorkspaceForm />
                    </div>
                </div>
                <div className="w-2/3"> </div>
            </div>
        </div>
    );
}

export default HomepageView;