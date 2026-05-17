"use strict";

const UserInsertOrUpdate = (props) => {

    const id = props.match && props.match.params ? props.match.params.id : "";
    const action = id ? "update" : "insert";

    const [userData, setUserData] = React.useState({
        "webUserId": "",
        "userEmail": "",
        "userPassword": "",
        "userPassword2": "",
        "userImage": "",
        "birthday": "",
        "membershipFee": "",
        "userRoleId": "",
        "errorMsg": ""
    });

    const [roleList, setRoleList] = React.useState([]);

    const [errorObj, setErrorObj] = React.useState({
        "webUserId": "",
        "userEmail": "",
        "userPassword": "",
        "userPassword2": "",
        "userImage": "",
        "birthday": "",
        "membershipFee": "",
        "userRoleId": "",
        "errorMsg": ""
    });

    const [isLoading, setIsLoading] = React.useState(true);

    const setProp = (obj, propName, propValue) => {
        let copy = Object.assign({}, obj);
        copy[propName] = propValue;
        return copy;
    };

    const encodeUserInput = () => {
        const userInputObj = {
            "webUserId": userData.webUserId,
            "userEmail": userData.userEmail,
            "userPassword": userData.userPassword,
            "userPassword2": userData.userPassword2,
            "userImage": userData.userImage,
            "birthday": userData.birthday,
            "membershipFee": userData.membershipFee,
            "userRoleId": userData.userRoleId
        };
        return encodeURIComponent(JSON.stringify(userInputObj));
    };

    React.useEffect(() => {

        ajax_alt(
            "role/getAll",
            function (obj) {
                if (obj.dbError && obj.dbError.length > 0) {
                    setErrorObj(prev => setProp(prev, "userRoleId", obj.dbError));
                    setIsLoading(false);
                } else {
                    let roles = obj.roleList ? JSON.parse(JSON.stringify(obj.roleList)) : [];

                    roles.sort(function (a, b) {
                        if (a.userRoleType > b.userRoleType) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });

                    setRoleList(roles);

                    if (action === "update") {
                        ajax_alt(
                            "webUser/getById?userId=" + id,
                            function (userObj) {
                                if (userObj.errorMsg && userObj.errorMsg.length > 0) {
                                    setErrorObj(prev => setProp(prev, "errorMsg", userObj.errorMsg));
                                } else {
                                    setUserData({
                                        "webUserId": userObj.webUserId || "",
                                        "userEmail": userObj.userEmail || "",
                                        "userPassword": userObj.userPassword || "",
                                        "userPassword2": userObj.userPassword || "",
                                        "userImage": userObj.userImage || "",
                                        "birthday": userObj.birthday || "",
                                        "membershipFee": userObj.membershipFee || "",
                                        "userRoleId": userObj.userRoleId || "",
                                        "errorMsg": ""
                                    });
                                }
                                setIsLoading(false);
                            },
                            function (ajaxErrorMsg) {
                                setErrorObj(prev => setProp(prev, "errorMsg", ajaxErrorMsg));
                                setIsLoading(false);
                            }
                        );
                    } else {
                        let firstRoleId = "";
                        if (roles.length > 0) {
                            firstRoleId = roles[0].userRoleId;
                        }

                        setUserData(prev => setProp(prev, "userRoleId", firstRoleId));
                        setIsLoading(false);
                    }
                }
            },
            function (ajaxErrorMsg) {
                setErrorObj(prev => setProp(prev, "errorMsg", ajaxErrorMsg));
                setIsLoading(false);
            }
        );

    }, []);

    const validate = () => {
        setIsLoading(true);

        ajax_alt(
            "webUser/" + action + "?jsonData=" + encodeUserInput(),
            function (obj) {
                if (obj.errorMsg.length === 0) {
                    obj.errorMsg = "Record Saved!";
                }
                setErrorObj(obj);
                setIsLoading(false);
            },
            function (ajaxErrorMsg) {
                setErrorObj(prev => setProp(prev, "errorMsg", ajaxErrorMsg));
                setIsLoading(false);
            }
        );
    };

    if (isLoading) {
        return <div className="insertUpdate">... Loading ...</div>;
    }

    return (
        <div className="insertUpdate">
            <h2 className="insertUpdateTitle">
                {action === "insert" ? "Register User" : "Update User"}
            </h2>
            <div className="insertUpdateHint">
                {action === "insert"
                    ? "Enter the information below to create a new user."
                    : "Edit the existing user information below and click Save."}
            </div>

            <table className="insertArea">
                <tbody>

                    <tr>
                        <td>Id</td>
                        <td>
                            <input value={userData.webUserId} disabled />
                        </td>
                        <td className="error">{errorObj.webUserId}</td>
                    </tr>

                    <tr>
                        <td>Email</td>
                        <td>
                            <input
                                value={userData.userEmail}
                                onChange={e => setUserData(setProp(userData, "userEmail", e.target.value))}
                            />
                        </td>
                        <td className="error">{errorObj.userEmail}</td>
                    </tr>

                    <tr>
                        <td>Password</td>
                        <td>
                            <input
                                type="password"
                                value={userData.userPassword}
                                onChange={e => setUserData(setProp(userData, "userPassword", e.target.value))}
                            />
                        </td>
                        <td className="error">{errorObj.userPassword}</td>
                    </tr>

                    <tr>
                        <td>Re-enter Password</td>
                        <td>
                            <input
                                type="password"
                                value={userData.userPassword2}
                                onChange={e => setUserData(setProp(userData, "userPassword2", e.target.value))}
                            />
                        </td>
                        <td className="error">{errorObj.userPassword2}</td>
                    </tr>

                    <tr>
                        <td>Image</td>
                        <td>
                            <input
                                value={userData.userImage}
                                onChange={e => setUserData(setProp(userData, "userImage", e.target.value))}
                            />
                        </td>
                        <td className="error">{errorObj.userImage}</td>
                    </tr>

                    <tr>
                        <td>Birthday</td>
                        <td>
                            <input
                                value={userData.birthday}
                                onChange={e => setUserData(setProp(userData, "birthday", e.target.value))}
                            />
                        </td>
                        <td className="error">{errorObj.birthday}</td>
                    </tr>

                    <tr>
                        <td>Membership Fee</td>
                        <td>
                            <input
                                value={userData.membershipFee}
                                onChange={e => setUserData(setProp(userData, "membershipFee", e.target.value))}
                            />
                        </td>
                        <td className="error">{errorObj.membershipFee}</td>
                    </tr>

                    <tr>
                        <td>Role</td>
                        <td>
                            <select
                                value={userData.userRoleId}
                                onChange={e => setUserData(setProp(userData, "userRoleId", e.target.value))}
                            >
                                {roleList.map(role =>
                                    <option key={role.userRoleId} value={role.userRoleId}>
                                        {role.userRoleType}
                                    </option>
                                )}
                            </select>
                        </td>
                        <td className="error">{errorObj.userRoleId}</td>
                    </tr>

                    <tr>
                        <td>
                            <br />
                            <button type="button" onClick={validate}>Save</button>
                        </td>
                        <td className="error" colSpan="2">
                            <br />
                            {errorObj.errorMsg}
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
    );
};