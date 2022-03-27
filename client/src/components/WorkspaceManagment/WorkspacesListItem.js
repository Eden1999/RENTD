const WorkspacesListItem = ({ workspace }) => {
    return (
        <div className={
            `flex bg-zinc-500 hover:bg-zinc-500/90 transition-all duration-200 rounded-lg p-3
            hover:cursor-pointer    
        `}>
            <img src={workspace.photo} className={'h-28 w-48 bg-zinc-400 rounded-md'} />
            <div className={'flex flex-col text-left flex-1 ml-8'}>
                <span className={'text-xl text-zinc-100'}>{workspace.name}</span>
                <span className={'text-sm text-zinc-300 mt-1.5'}>{workspace.address}</span>
                <span className={'mt-auto text-xs text-zinc-300'}>Opens: {workspace.opening_hour} - {workspace.closing_hour}</span>
            </div>
        </div>
    );
}

export default WorkspacesListItem;