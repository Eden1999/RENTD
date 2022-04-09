import {Container, IconButton} from "@mui/material";
import WorkspacesList from "./WorkspacesList";
import {AddCircleOutline} from "@mui/icons-material";
import {Link} from "react-router-dom";

const MySpaces = () => {
    return (
        <Container className={'h-full'}>
            <div className={'flex h-full'}>
                <div className={'flex flex-1 flex-col mr-10'}>
                    <div className={'flex justify-between mt-8 text-3xl text-zinc-200'}>
                        <span>
                            My workspaces
                        </span>
                        <Link to={'/manage/newWorkspace'}>
                            <IconButton aria-label="new workspace" color='primary'>
                                <AddCircleOutline />
                            </IconButton>
                        </Link>
                    </div>
                    <div className={'flex mt-10'}>
                        <WorkspacesList isEditable={true}/>
                    </div>
                </div>

                <div className={'m-4 rounded-xl flex flex-1 w-full bg-zinc-300/20'}></div>
            </div>
        </Container>
    )
}

export default MySpaces;