const handleLogoutClick = () => {
    console.log("handleLogoutClick clicked");

    localStorage.removeItem("user");
};

export default handleLogoutClick;
