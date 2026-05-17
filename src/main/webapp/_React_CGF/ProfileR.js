"use strict";

const ProfileR = () => {

    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState(null);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        ajax_alt(
            "webUser/getProfile",
            function (obj) {
                if (obj.errorMsg && obj.errorMsg.length > 0) {
                    setError(obj.errorMsg);
                    setUser(null);
                } else {
                    setError("");
                    setUser(obj);
                }
                setIsLoading(false);
            },
            function (msg) {
                setError(msg);
                setUser(null);
                setIsLoading(false);
            }
        );
    }, []);

    if (isLoading) {
        return <div className="accountBox">Loading...</div>;
    }

    if (error) {
        return <div className="accountBox"><div className="accountError">{error}</div></div>;
    }

    return <WebUserDisplay title="Profile" user={user} />;
};