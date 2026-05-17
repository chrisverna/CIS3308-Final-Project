"use strict";

const StatsInsertOrUpdate = (props) => {

    const id = props.match && props.match.params ? props.match.params.id : "";
    const action = id ? "update" : "insert";

    const [statsData, setStatsData] = React.useState({
        "stats_id": "",
        "player_name": "",
        "image": "",
        "total_tackles": "",
        "solo_tackles": "",
        "interceptions": "",
        "sacks": "",
        "tackles_for_loss": "",
        "accolades": "",
        "web_user_id": "",
        "errorMsg": ""
    });

    const [userList, setUserList] = React.useState([]);

    const [errorObj, setErrorObj] = React.useState({
        "stats_id": "",
        "player_name": "",
        "image": "",
        "total_tackles": "",
        "solo_tackles": "",
        "interceptions": "",
        "sacks": "",
        "tackles_for_loss": "",
        "accolades": "",
        "web_user_id": "",
        "errorMsg": ""
    });

    const [isLoading, setIsLoading] = React.useState(true);

    const setProp = (obj, propName, propValue) => {
        let copy = Object.assign({}, obj);
        copy[propName] = propValue;
        return copy;
    };

    const encodeStatsInput = () => {
        const statsInputObj = {
            "stats_id": statsData.stats_id,
            "player_name": statsData.player_name,
            "image": statsData.image,
            "total_tackles": statsData.total_tackles,
            "solo_tackles": statsData.solo_tackles,
            "interceptions": statsData.interceptions,
            "sacks": statsData.sacks,
            "tackles_for_loss": statsData.tackles_for_loss,
            "accolades": statsData.accolades,
            "web_user_id": statsData.web_user_id
        };
        return encodeURIComponent(JSON.stringify(statsInputObj));
    };

    React.useEffect(() => {

        ajax_alt(
            "webUser/getAll",
            function (obj) {
                if (obj.dbError && obj.dbError.length > 0) {
                    setErrorObj(prev => setProp(prev, "web_user_id", obj.dbError));
                    setIsLoading(false);
                } else {
                    let users = obj.webUserList ? JSON.parse(JSON.stringify(obj.webUserList)) : [];

                    users.sort(function (a, b) {
                        if (a.userEmail > b.userEmail) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });

                    setUserList(users);

                    if (action === "update") {
                        ajax_alt(
                            "stats/getById?statsId=" + id,
                            function (statsObj) {
                                if (statsObj.errorMsg && statsObj.errorMsg.length > 0) {
                                    setErrorObj(prev => setProp(prev, "errorMsg", statsObj.errorMsg));
                                } else {
                                    setStatsData({
                                        "stats_id": statsObj.stats_id || "",
                                        "player_name": statsObj.player_name || "",
                                        "image": statsObj.image || "",
                                        "total_tackles": statsObj.total_tackles || "",
                                        "solo_tackles": statsObj.solo_tackles || "",
                                        "interceptions": statsObj.interceptions || "",
                                        "sacks": statsObj.sacks || "",
                                        "tackles_for_loss": statsObj.tackles_for_loss || "",
                                        "accolades": statsObj.accolades || "",
                                        "web_user_id": statsObj.web_user_id || "",
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
                        let firstUserId = "";
                        if (users.length > 0) {
                            firstUserId = users[0].webUserId;
                        }
                        setStatsData(prev => setProp(prev, "web_user_id", firstUserId));
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
            "stats/" + action + "?jsonData=" + encodeStatsInput(),
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
                {action === "insert" ? "Insert Stats Record" : "Update Stats Record"}
            </h2>
            <div className="insertUpdateHint">
                {action === "insert"
                    ? "Enter the player statistics below to create a new record."
                    : "Edit the existing statistics below and click Save."}
            </div>

            <table className="insertArea">
                <tbody>

                    <tr>
                        <td>ID</td>
                        <td>
                            <input value={statsData.stats_id} disabled />
                        </td>
                        <td className="error">{errorObj.stats_id}</td>
                    </tr>

                    <tr>
                        <td>Player Name</td>
                        <td>
                            <input
                                value={statsData.player_name}
                                onChange={e => setStatsData(setProp(statsData, "player_name", e.target.value))}
                            />
                        </td>
                        <td className="error">{errorObj.player_name}</td>
                    </tr>

                    <tr>
                        <td>Image</td>
                        <td>
                            <input
                                value={statsData.image}
                                onChange={e => setStatsData(setProp(statsData, "image", e.target.value))}
                            />
                        </td>
                        <td className="error">{errorObj.image}</td>
                    </tr>

                    <tr>
                        <td>Total Tackles</td>
                        <td>
                            <input
                                value={statsData.total_tackles}
                                onChange={e => setStatsData(setProp(statsData, "total_tackles", e.target.value))}
                            />
                        </td>
                        <td className="error">{errorObj.total_tackles}</td>
                    </tr>

                    <tr>
                        <td>Solo Tackles</td>
                        <td>
                            <input
                                value={statsData.solo_tackles}
                                onChange={e => setStatsData(setProp(statsData, "solo_tackles", e.target.value))}
                            />
                        </td>
                        <td className="error">{errorObj.solo_tackles}</td>
                    </tr>

                    <tr>
                        <td>Interceptions</td>
                        <td>
                            <input
                                value={statsData.interceptions}
                                onChange={e => setStatsData(setProp(statsData, "interceptions", e.target.value))}
                            />
                        </td>
                        <td className="error">{errorObj.interceptions}</td>
                    </tr>

                    <tr>
                        <td>Sacks</td>
                        <td>
                            <input
                                value={statsData.sacks}
                                onChange={e => setStatsData(setProp(statsData, "sacks", e.target.value))}
                            />
                        </td>
                        <td className="error">{errorObj.sacks}</td>
                    </tr>

                    <tr>
                        <td>Tackles for Loss</td>
                        <td>
                            <input
                                value={statsData.tackles_for_loss}
                                onChange={e => setStatsData(setProp(statsData, "tackles_for_loss", e.target.value))}
                            />
                        </td>
                        <td className="error">{errorObj.tackles_for_loss}</td>
                    </tr>

                    <tr>
                        <td>Accolades</td>
                        <td>
                            <input
                                value={statsData.accolades}
                                onChange={e => setStatsData(setProp(statsData, "accolades", e.target.value))}
                            />
                        </td>
                        <td className="error">{errorObj.accolades}</td>
                    </tr>

                    <tr>
                        <td>Web User</td>
                        <td>
                            <select
                                value={statsData.web_user_id}
                                onChange={e => setStatsData(setProp(statsData, "web_user_id", e.target.value))}
                            >
                                {userList.map(user =>
                                    <option key={user.webUserId} value={user.webUserId}>
                                        {user.userEmail}
                                    </option>
                                )}
                            </select>
                        </td>
                        <td className="error">{errorObj.web_user_id}</td>
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