"use strict";

const UserFilterSortTable = () => {

    const [isLoading, setIsLoading] = React.useState(true);
    const [dbList, setDbList] = React.useState([]);
    const [filteredList, setFilteredList] = React.useState([]);
    const [error, setError] = React.useState("");
    const [successMsg, setSuccessMsg] = React.useState("");
    const [filterInput, setFilterInput] = React.useState("");
    const [sortState, setSortState] = React.useState({
        propName: "userEmail",
        sortType: "text",
        ascending: true
    });

    React.useEffect(() => {
        ajax_alt(
            "webUser/getAll",
            function (obj) {
                if (obj.dbError && obj.dbError.length > 0) {
                    setError(obj.dbError);
                } else {
                    let users = obj.webUserList ? JSON.parse(JSON.stringify(obj.webUserList)) : [];
                    jsSort(users, "userEmail", "text");
                    setDbList(users);
                    setFilteredList(users);
                }
                setIsLoading(false);
            },
            function (msg) {
                setError(msg);
                setIsLoading(false);
            }
        );
    }, []);

    function sortByProp(propName, sortType) {
        let newAscending = true;

        if (sortState.propName === propName) {
            newAscending = !sortState.ascending;
        }

        let listCopy = JSON.parse(JSON.stringify(filteredList));
        jsSort(listCopy, propName, sortType);

        if (!newAscending) {
            listCopy.reverse();
        }

        setFilteredList(listCopy);
        setSortState({
            propName: propName,
            sortType: sortType,
            ascending: newAscending
        });
    }

    function doFilter() {
        let newList = filterObjList(dbList, filterInput);
        jsSort(newList, sortState.propName, sortState.sortType);

        if (!sortState.ascending) {
            newList.reverse();
        }

        setFilteredList(newList);
    }

    function clearFilter() {
        let listCopy = JSON.parse(JSON.stringify(dbList));
        jsSort(listCopy, sortState.propName, sortState.sortType);

        if (!sortState.ascending) {
            listCopy.reverse();
        }

        setFilterInput("");
        setFilteredList(listCopy);
    }

    function callInsert() {
        window.location.hash = "#/userInsert";
    }

    function deleteUser(userId, userEmail) {
        setError("");
        setSuccessMsg("");

        if (!confirm("Are you sure you want to delete web user " + userEmail + "?")) {
            return;
        }

        ajax_alt(
            "webUser/delete?userId=" + encodeURIComponent(userId),

            function (obj) {
                if (obj.errorMsg && obj.errorMsg.length > 0) {
                    setError(obj.errorMsg);
                } else {
                    let newDbList = dbList.filter(user => user.webUserId !== userId);
                    let newFilteredList = filteredList.filter(user => user.webUserId !== userId);

                    setDbList(newDbList);
                    setFilteredList(newFilteredList);
                    setSuccessMsg("Web user " + userEmail + " was deleted.");
                }
            },

            function (msg) {
                setError(msg);
            }
        );
    }

    if (isLoading) {
        return <div className="clickSort">Loading...</div>;
    }

    return (
        <div className="clickSort">

            <h3>
                Users&nbsp;
                <img
                    src="icons/dark/blackInsert.png"
                    alt="insert"
                    onClick={callInsert}
                    style={{ cursor: "pointer", verticalAlign: "middle" }}
                />
                &nbsp;
                <label htmlFor="userFilter">Filter:</label>
                <input
                    id="userFilter"
                    value={filterInput}
                    onChange={(e) => setFilterInput(e.target.value)}
                />
                <button onClick={doFilter}>Search</button>
                <button onClick={clearFilter}>Clear</button>
            </h3>

            {error.length > 0 ? <div className="error">{error}</div> : ""}
            {successMsg.length > 0 ? <div>{successMsg}</div> : ""}

            <table>
                <thead>
                    <tr>
                        <th>Edit</th>
                        <th>Delete</th>

                        <th className="sortable" onClick={() => sortByProp("userEmail", "text")}>
                            <img src="icons/dark/blackDownSort.png" alt="sort" />
                            Email
                        </th>

                        <th className="textAlignCenter">Image</th>

                        <th className="sortable textAlignCenter" onClick={() => sortByProp("birthday", "date")}>
                            <img src="icons/dark/blackDownSort.png" alt="sort" />
                            Birthday
                        </th>

                        <th className="sortable textAlignRight" onClick={() => sortByProp("membershipFee", "number")}>
                            <img src="icons/dark/blackDownSort.png" alt="sort" />
                            Membership Fee
                        </th>

                        <th className="sortable" onClick={() => sortByProp("userRoleType", "text")}>
                            <img src="icons/dark/blackDownSort.png" alt="sort" />
                            Role
                        </th>

                        <th>Error</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredList.map((obj) => (
                        <tr key={obj.webUserId}>
                            <td className="textAlignCenter">
                                <a href={"#/userUpdate/" + obj.webUserId}>
                                    <img src="icons/dark/blackUpdate.png" alt="edit" className="clickLink" />
                                </a>
                            </td>

                            <td className="textAlignCenter">
                                <img
                                    src="icons/dark/blackDelete.png"
                                    alt="delete"
                                    className="clickLink"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => deleteUser(obj.webUserId, obj.userEmail)}
                                />
                            </td>

                            <td>{obj.userEmail} ({obj.webUserId})</td>

                            <td className="shadowImage textAlignCenter">
                                <img src={obj.userImage} alt="user" />
                            </td>

                            <td className="textAlignCenter">{obj.birthday}</td>
                            <td className="textAlignRight">{obj.membershipFee}</td>
                            <td className="nowrap">{obj.userRoleType}</td>
                            <td>{obj.errorMsg}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};