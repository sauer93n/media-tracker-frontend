export const Spinner = () => {
    return (
        <div className="flex justify-center items-center w-full h-full bg-transparent absolute bottom-0 left-0">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7167fa] bg-transparent absolute"></div>
        </div>
    );
};
