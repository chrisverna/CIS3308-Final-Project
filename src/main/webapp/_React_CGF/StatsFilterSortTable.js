"use strict";

const StatsFilterSortTable = () => {

    const [isLoading, setIsLoading] = React.useState(true);
    const [dbList, setDbList] = React.useState([]);
    const [filteredList, setFilteredList] = React.useState([]);
    const [error, setError] = React.useState("");
    const [successMsg, setSuccessMsg] = React.useState("");
    const [filterInput, setFilterInput] = React.useState("");
    const [sortState, setSortState] = React.useState({
        propName: "player_name",
        sortType: "text",
        ascending: true
    });

    React.useEffect(() => {
        ajax_alt(
            "stats/getAll",
            function (obj) {
                if (obj.dbError && obj.dbError.length > 0) {
                    setError(obj.dbError);
                } else {
                    let stats = obj.statsList ? JSON.parse(JSON.stringify(obj.statsList)) : [];
                    jsSort(stats, "player_name", "text");
                    setDbList(stats);
                    setFilteredList(stats);
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
        window.location.hash = "#/statsInsert";
    }

    function deleteStats(statsId, playerName) {
        setError("");
        setSuccessMsg("");

        if (!confirm("Are you sure you want to delete stats record for " + playerName + "?")) {
            return;
        }

        ajax_alt(
            "stats/delete?statsId=" + encodeURIComponent(statsId),

            function (obj) {
                if (obj.errorMsg && obj.errorMsg.length > 0) {
                    setError(obj.errorMsg);
                } else {
                    let newDbList = dbList.filter(stats => stats.stats_id !== statsId);
                    let newFilteredList = filteredList.filter(stats => stats.stats_id !== statsId);

                    setDbList(newDbList);
                    setFilteredList(newFilteredList);
                    setSuccessMsg("Stats record for " + playerName + " was deleted.");
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
                Eagles Defensive Stats&nbsp;
                <img
                    src="icons/dark/blackInsert.png"
                    alt="insert"
                    onClick={callInsert}
                    style={{ cursor: "pointer" }}
                />
                &nbsp;
                <label htmlFor="statsFilter">Filter:</label>
                <input
                    id="statsFilter"
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

                        <th className="sortable" onClick={() => sortByProp("player_name", "text")}>
                            <img src="icons/dark/blackDownSort.png" alt="sort" />
                            Player
                        </th>

                        <th className="textAlignCenter">Image</th>

                        <th className="sortable textAlignRight" onClick={() => sortByProp("total_tackles", "number")}>
                            <img src="icons/dark/blackDownSort.png" alt="sort" />
                            Total Tackles
                        </th>

                        <th className="sortable textAlignRight" onClick={() => sortByProp("solo_tackles", "number")}>
                            <img src="icons/dark/blackDownSort.png" alt="sort" />
                            Solo Tackles
                        </th>

                        <th className="sortable textAlignRight" onClick={() => sortByProp("sacks", "number")}>
                            <img src="icons/dark/blackDownSort.png" alt="sort" />
                            Sacks
                        </th>

                        <th className="sortable textAlignRight" onClick={() => sortByProp("interceptions", "number")}>
                            <img src="icons/dark/blackDownSort.png" alt="sort" />
                            Interceptions
                        </th>

                        <th>Uploaded by</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredList.map((obj) => (
                        <tr key={obj.stats_id}>
                            <td className="textAlignCenter">
                                <a href={"#/statsUpdate/" + obj.stats_id}>
                                    <img src="icons/dark/blackUpdate.png" alt="edit" className="clickLink" />
                                </a>
                            </td>

                            <td className="textAlignCenter">
                                <img
                                    src="icons/dark/blackDelete.png"
                                    alt="delete"
                                    className="clickLink"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => deleteStats(obj.stats_id, obj.player_name)}
                                />
                            </td>

                            <td>{obj.player_name}</td>

                            <td className="textAlignCenter shadowImage">
                                <img src={obj.image} alt="player" />
                            </td>

                            <td className="textAlignRight">{obj.total_tackles}</td>
                            <td className="textAlignRight">{obj.solo_tackles}</td>
                            <td className="textAlignRight">{obj.sacks}</td>
                            <td className="textAlignRight">{obj.interceptions}</td>
                            <td>{obj.user_email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};