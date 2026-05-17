package model.stats;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import dbUtils.*;

public class DbMods {

    private static StringData validate(StringData inputData) {

        StringData errorMsgs = new StringData();

        errorMsgs.player_name = Validate.stringMsg(inputData.player_name, 45, true);
        errorMsgs.image = Validate.stringMsg(inputData.image, 300, false);

        errorMsgs.total_tackles = Validate.integerMsg(inputData.total_tackles, false);
        errorMsgs.solo_tackles = Validate.integerMsg(inputData.solo_tackles, false);
        errorMsgs.interceptions = Validate.integerMsg(inputData.interceptions, false);
        errorMsgs.sacks = Validate.decimalMsg(inputData.sacks, false);
        errorMsgs.tackles_for_loss = Validate.integerMsg(inputData.tackles_for_loss, false);
        errorMsgs.accolades = Validate.stringMsg(inputData.accolades, 255, false);

        errorMsgs.web_user_id = Validate.integerMsg(inputData.web_user_id, true);

        return errorMsgs;
    }

    public static StringData insert(StringData inputData, DbConn dbc) {

        StringData errorMsgs = validate(inputData);

        if (errorMsgs.errorMsg == null) {
            errorMsgs.errorMsg = "";
        }

        if (characterCount(errorMsgs) > 0) {
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;
        }

        String sql = "INSERT INTO stats "
                + "(player_name, image, total_tackles, solo_tackles, interceptions, sacks, tackles_for_loss, accolades, web_user_id) "
                + "values (?,?,?,?,?,?,?,?,?)";

        PrepStatement pStatement = new PrepStatement(dbc, sql);

        pStatement.setString(1, inputData.player_name);
        pStatement.setString(2, inputData.image);
        pStatement.setInt(3, Validate.convertInteger(inputData.total_tackles));
        pStatement.setInt(4, Validate.convertInteger(inputData.solo_tackles));
        pStatement.setInt(5, Validate.convertInteger(inputData.interceptions));
        pStatement.setBigDecimal(6, Validate.convertDecimal(inputData.sacks));
        pStatement.setInt(7, Validate.convertInteger(inputData.tackles_for_loss));
        pStatement.setString(8, inputData.accolades);
        pStatement.setInt(9, Validate.convertInteger(inputData.web_user_id));

        int numRows = pStatement.executeUpdate();

        errorMsgs.errorMsg = pStatement.getErrorMsg();

        if (errorMsgs.errorMsg.length() == 0) {
            if (numRows == 1) {
                errorMsgs.errorMsg = "";
            } else {
                errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
            }
        } else if (errorMsgs.errorMsg.toLowerCase().contains("foreign key")) {
            errorMsgs.errorMsg = "Invalid Web User - " + errorMsgs.errorMsg;
        } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
            errorMsgs.errorMsg = "That player name is already taken - " + errorMsgs.errorMsg;
        }

        return errorMsgs;
    }

    public static StringData update(StringData updateData, DbConn dbc) {

        StringData errorMsgs = validate(updateData);
        errorMsgs.stats_id = Validate.integerMsg(updateData.stats_id, true);

        if (errorMsgs.errorMsg == null) {
            errorMsgs.errorMsg = "";
        }

        if (characterCount(errorMsgs) > 0) {
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;
        }

        String sql = "UPDATE stats SET player_name = ?, image = ?, total_tackles = ?, "
                + "solo_tackles = ?, interceptions = ?, sacks = ?, tackles_for_loss = ?, "
                + "accolades = ?, web_user_id = ? WHERE stats_id = ?";

        PrepStatement pStatement = new PrepStatement(dbc, sql);

        pStatement.setString(1, updateData.player_name);
        pStatement.setString(2, updateData.image);
        pStatement.setInt(3, Validate.convertInteger(updateData.total_tackles));
        pStatement.setInt(4, Validate.convertInteger(updateData.solo_tackles));
        pStatement.setInt(5, Validate.convertInteger(updateData.interceptions));
        pStatement.setBigDecimal(6, Validate.convertDecimal(updateData.sacks));
        pStatement.setInt(7, Validate.convertInteger(updateData.tackles_for_loss));
        pStatement.setString(8, updateData.accolades);
        pStatement.setInt(9, Validate.convertInteger(updateData.web_user_id));
        pStatement.setInt(10, Validate.convertInteger(updateData.stats_id));

        int numRows = pStatement.executeUpdate();

        errorMsgs.errorMsg = pStatement.getErrorMsg();

        if (errorMsgs.errorMsg.length() == 0) {
            if (numRows == 1) {
                errorMsgs.errorMsg = "";
            } else {
                errorMsgs.errorMsg = numRows + " records were updated when exactly 1 was expected.";
            }
        } else if (errorMsgs.errorMsg.toLowerCase().contains("foreign key")) {
            errorMsgs.errorMsg = "Invalid Web User - " + errorMsgs.errorMsg;
        } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
            errorMsgs.errorMsg = "That player name is already taken - " + errorMsgs.errorMsg;
        }

        return errorMsgs;
    }

    public static String delete(DbConn dbc, String id) {

        if (dbc.getErr().length() > 0) {
            return "The database is currently unavailable. Please try later or contact support. "
                    + dbc.getErr();
        }

        if (id == null || id.length() == 0) {
            return "Cannot delete stats record. No stats id was provided.";
        }

        String idMsg = Validate.integerMsg(id, true);
        if (idMsg.length() > 0) {
            return "Cannot delete stats record. The stats id must be an integer.";
        }

        String sql = "DELETE FROM stats WHERE stats_id = ?";
        PrepStatement pStatement = new PrepStatement(dbc, sql);

        pStatement.setInt(1, Validate.convertInteger(id));

        int numRows = pStatement.executeUpdate();
        String errorMsg = pStatement.getErrorMsg();

        if (errorMsg.length() == 0) {
            if (numRows == 1) {
                return "";
            } else {
                return "This stats record must have been deleted just now by another user.";
            }
        } else if (errorMsg.toLowerCase().contains("foreign key")) {
            return "This stats record could not be deleted because another record is associated with it. "
                    + errorMsg;
        } else {
            return "This stats record could not be deleted. " + errorMsg;
        }
    }

    public static StringData getById(DbConn dbc, String id) {
        StringData sd = new StringData();

        if (id == null) {
            sd.errorMsg = "Cannot getById (stats): id is null";
            return sd;
        }

        Integer intId;
        try {
            intId = Integer.valueOf(id);
        } catch (Exception e) {
            sd.errorMsg = "Cannot getById (stats): id must be an integer.";
            return sd;
        }

        try {
            String sql = "SELECT s.stats_id, s.player_name, s.image, s.total_tackles, "
                    + "s.solo_tackles, s.interceptions, s.sacks, s.tackles_for_loss, "
                    + "s.accolades, s.web_user_id, wu.user_email "
                    + "FROM stats s "
                    + "LEFT JOIN web_user wu ON s.web_user_id = wu.web_user_id "
                    + "WHERE s.stats_id = ?";

            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            stmt.setInt(1, intId);

            ResultSet results = stmt.executeQuery();

            if (results.next()) {
                sd.stats_id = Format.fmtInteger(results.getObject("stats_id"));
                sd.player_name = Format.fmtString(results.getObject("player_name"));
                sd.image = Format.fmtString(results.getObject("image"));
                sd.total_tackles = Format.fmtInteger(results.getObject("total_tackles"));
                sd.solo_tackles = Format.fmtInteger(results.getObject("solo_tackles"));
                sd.interceptions = Format.fmtInteger(results.getObject("interceptions"));
                sd.sacks = Format.fmtDecimal(results.getObject("sacks"));
                sd.tackles_for_loss = Format.fmtInteger(results.getObject("tackles_for_loss"));
                sd.accolades = Format.fmtString(results.getObject("accolades"));
                sd.web_user_id = Format.fmtInteger(results.getObject("web_user_id"));
                sd.user_email = Format.fmtString(results.getObject("user_email"));
                sd.errorMsg = "";
            } else {
                sd.errorMsg = "Stats record not found.";
            }

            results.close();
            stmt.close();

        } catch (Exception e) {
            sd.errorMsg = "Exception in stats DbMods.getById(): " + e.getMessage();
        }

        return sd;
    }

    private static int characterCount(StringData sd) {
        int count = 0;

        count += sd.stats_id.length();
        count += sd.player_name.length();
        count += sd.image.length();
        count += sd.total_tackles.length();
        count += sd.solo_tackles.length();
        count += sd.interceptions.length();
        count += sd.sacks.length();
        count += sd.tackles_for_loss.length();
        count += sd.accolades.length();
        count += sd.web_user_id.length();
        count += sd.user_email.length();
        count += sd.errorMsg.length();

        return count;
    }
}