import {Container} from "@mui/material";
import WorkspacesList from "./WorkspacesList";

const MySpaces = () => {
    return (
        <Container className={'h-full'}>
            <div className={'flex h-full'}>
                <div className={'flex flex-1 flex-col mr-10'}>
                    <div className={'mt-8 text-3xl text-zinc-200'}>My workspaces</div>

                    <div className={'flex mt-10'}>
                        <WorkspacesList />
                    </div>
                </div>

                <div className={'m-4 rounded-xl flex flex-1 w-full bg-zinc-300/20'}></div>
            </div>
        </Container>
    )
}

export default MySpaces;