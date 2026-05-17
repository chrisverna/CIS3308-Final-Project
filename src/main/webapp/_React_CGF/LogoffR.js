"use strict";

const LogoffR = () => {

    const [isLoading, setIsLoading] = React.useState(true);
    const [message, setMessage] = React.useState("");

    React.useEffect(() => {
        ajax_alt(
            "webUser/logoff",
            function (obj) {
                setMessage(obj.errorMsg);
                setIsLoading(false);
            },
            function (msg) {
                setMessage(msg);
                setIsLoading(false);
            }
        );
    }, []);

    if (isLoading) {
        return <div className="accountBox">Loading...</div>;
    }

    return (
        <div className="accountBox">
            <h2>Log Off</h2>
            <div className="accountMessage">{message}</div>
        </div>
    );
};