"use strict";

const LogonR = () => {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [user, setUser] = React.useState(null);
    const [error, setError] = React.useState("");

    function doLogon() {

        let url = "webUser/logon?email=" + encodeURIComponent(email)
                + "&password=" + encodeURIComponent(password);

        ajax_alt(
            url,
            function (obj) {
                if (obj.errorMsg && obj.errorMsg.length > 0) {
                    setError(obj.errorMsg);
                    setUser(null);
                } else {
                    setError("");
                    setUser(obj);
                }
            },
            function (msg) {
                setError(msg);
                setUser(null);
            }
        );
    }

    return (
        <div className="accountBox">
            <h2>Log On</h2>

            <div className="accountForm">
                <label htmlFor="logonEmail">Email Address</label>
                <input
                    id="logonEmail"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="logonPassword">Password</label>
                <input
                    id="logonPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={doLogon}>Log On</button>
            </div>

            {error ? <div className="accountError">{error}</div> : null}

            {user ? <WebUserDisplay title="Welcome" user={user} /> : null}
        </div>
    );
};