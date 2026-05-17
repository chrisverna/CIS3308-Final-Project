package model.webUser;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import dbUtils.*;

public class DbMods {

    private static StringData validate(StringData inputData) {

        StringData errorMsgs = new StringData();

        errorMsgs.userEmail = Validate.stringMsg(inputData.userEmail, 45, true);
        errorMsgs.userPassword = Validate.stringMsg(inputData.userPassword, 45, true);

        if (inputData.userPassword.compareTo(inputData.userPassword2) != 0) {
            errorMsgs.userPassword2 = "Both passwords must match";
        }

        errorMsgs.userImage = Validate.stringMsg(inputData.userImage, 300, false);
        errorMsgs.birthday = Validate.dateMsg(inputData.birthday, false);
        errorMsgs.membershipFee = Validate.decimalMsg(inputData.membershipFee, false);
        errorMsgs.userRoleId = Validate.integerMsg(inputData.userRoleId, true);

        return errorMsgs;
    }

    public static StringData insert(StringData inputData, DbConn dbc) {

        StringData errorMsgs = validate(inputData);

        if (errorMsgs.characterCount() > 0) {
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;
        }

        String sql = "INSERT INTO web_user "
                + "(user_email, user_password, user_image, membership_fee, birthday, user_role_id) "
                + "values (?,?,?,?,?,?)";

        PrepStatement pStatement = new PrepStatement(dbc, sql);

        pStatement.setString(1, inputData.userEmail);
        pStatement.setString(2, inputData.userPassword);
        pStatement.setString(3, inputData.userImage);
        pStatement.setBigDecimal(4, Validate.convertDecimal(inputData.membershipFee));
        pStatement.setDate(5, Validate.convertDate(inputData.birthday));
        pStatement.setInt(6, Validate.convertInteger(inputData.userRoleId));

        int numRows = pStatement.executeUpdate();

        errorMsgs.errorMsg = pStatement.getErrorMsg();

        if (errorMsgs.errorMsg.length() == 0) {
            if (numRows == 1) {
                errorMsgs.errorMsg = "";
            } else {
                errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
            }
        } else if (errorMsgs.errorMsg.contains("foreign key")) {
            errorMsgs.errorMsg = "Invalid User Role Id - " + errorMsgs.errorMsg;
        } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
            errorMsgs.errorMsg = "That email address is already taken - " + errorMsgs.errorMsg;
        }

        return errorMsgs;
    }

    public static StringData update(StringData updateData, DbConn dbc) {

        StringData errorMsgs = validate(updateData);
        errorMsgs.webUserId = Validate.integerMsg(updateData.webUserId, true);

        if (errorMsgs.characterCount() > 0) {
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;
        }

        String sql = "UPDATE web_user SET user_email = ?, user_password = ?, user_image = ?, "
                + "membership_fee = ?, birthday = ?, user_role_id = ? WHERE web_user_id = ?";

        PrepStatement pStatement = new PrepStatement(dbc, sql);

        pStatement.setString(1, updateData.userEmail);
        pStatement.setString(2, updateData.userPassword);
        pStatement.setString(3, updateData.userImage);
        pStatement.setBigDecimal(4, Validate.convertDecimal(updateData.membershipFee));
        pStatement.setDate(5, Validate.convertDate(updateData.birthday));
        pStatement.setInt(6, Validate.convertInteger(updateData.userRoleId));
        pStatement.setInt(7, Validate.convertInteger(updateData.webUserId));

        int numRows = pStatement.executeUpdate();

        errorMsgs.errorMsg = pStatement.getErrorMsg();

        if (errorMsgs.errorMsg.length() == 0) {
            if (numRows == 1) {
                errorMsgs.errorMsg = "";
            } else {
                errorMsgs.errorMsg = numRows + " records were updated when exactly 1 was expected.";
            }
        } else if (errorMsgs.errorMsg.contains("foreign key")) {
            errorMsgs.errorMsg = "Invalid User Role Id - " + errorMsgs.errorMsg;
        } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
            errorMsgs.errorMsg = "That email address is already taken - " + errorMsgs.errorMsg;
        }

        return errorMsgs;
    }

    public static String delete(DbConn dbc, String id) {

        if (dbc.getErr().length() > 0) {
            return "The database is currently unavailable. Please try later or contact support. "
                    + dbc.getErr();
        }

        if (id == null || id.length() == 0) {
            return "Cannot delete web user. No user id was provided.";
        }

        String idMsg = Validate.integerMsg(id, true);
        if (idMsg.length() > 0) {
            return "Cannot delete web user. The user id must be an integer.";
        }

        String sql = "DELETE FROM web_user WHERE web_user_id = ?";
        PrepStatement pStatement = new PrepStatement(dbc, sql);

        pStatement.setInt(1, Validate.convertInteger(id));

        int numRows = pStatement.executeUpdate();
        String errorMsg = pStatement.getErrorMsg();

        if (errorMsg.length() == 0) {
            if (numRows == 1) {
                return "";
            } else {
                return "This user must have been deleted just now by another user.";
            }
        } else if (errorMsg.toLowerCase().contains("foreign key")) {
            return "This user could not be deleted because there are stats records associated with this account. "
                    + errorMsg;
        } else {
            return "This user could not be deleted. " + errorMsg;
        }
    }

    public static StringData getById(DbConn dbc, String id) {
        StringData sd = new StringData();

        if (id == null) {
            sd.errorMsg = "Cannot getById (webUser): id is null";
            return sd;
        }

        Integer intId;
        try {
            intId = Integer.valueOf(id);
        } catch (Exception e) {
            sd.errorMsg = "Cannot getById (webUser): id must be an integer.";
            return sd;
        }

        try {
            String sql = "SELECT web_user_id, user_email, user_password, user_image, membership_fee, birthday, "
                    + "web_user.user_role_id, user_role_type "
                    + "FROM web_user, user_role "
                    + "WHERE web_user.user_role_id = user_role.user_role_id "
                    + "AND web_user_id = ?";

            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            stmt.setInt(1, intId);

            ResultSet results = stmt.executeQuery();

            if (results.next()) {
                sd.webUserId = Format.fmtInteger(results.getObject("web_user_id"));
                sd.userEmail = Format.fmtString(results.getObject("user_email"));
                sd.userPassword = Format.fmtString(results.getObject("user_password"));
                sd.userPassword2 = Format.fmtString(results.getObject("user_password"));
                sd.userImage = Format.fmtString(results.getObject("user_image"));
                sd.birthday = Format.fmtDate(results.getObject("birthday"));
                sd.membershipFee = Format.fmtDollar(results.getObject("membership_fee"));
                sd.userRoleId = Format.fmtInteger(results.getObject("web_user.user_role_id"));
                sd.userRoleType = Format.fmtString(results.getObject("user_role_type"));
                sd.errorMsg = "";
            } else {
                sd.errorMsg = "Web user not found.";
            }

            results.close();
            stmt.close();

        } catch (Exception e) {
            sd.errorMsg = "Exception in DbMods.getById(): " + e.getMessage();
        }

        return sd;
    }

    public static StringData findByCredentials(DbConn dbc, String email, String password) {

        StringData sd = new StringData();

        if (dbc.getErr().length() > 0) {
            sd.errorMsg = dbc.getErr();
            return sd;
        }

        try {
            String sql = "SELECT web_user_id, user_email, user_password, user_image, membership_fee, birthday, "
                    + "web_user.user_role_id, user_role_type "
                    + "FROM web_user, user_role "
                    + "WHERE web_user.user_role_id = user_role.user_role_id "
                    + "AND user_email = ? AND user_password = ?";

            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            stmt.setString(1, email);
            stmt.setString(2, password);

            ResultSet results = stmt.executeQuery();

            if (results.next()) {
                sd.webUserId = Format.fmtInteger(results.getObject("web_user_id"));
                sd.userEmail = Format.fmtString(results.getObject("user_email"));
                sd.userPassword = Format.fmtString(results.getObject("user_password"));
                sd.userImage = Format.fmtString(results.getObject("user_image"));
                sd.birthday = Format.fmtDate(results.getObject("birthday"));
                sd.membershipFee = Format.fmtDollar(results.getObject("membership_fee"));
                sd.userRoleId = Format.fmtInteger(results.getObject("web_user.user_role_id"));
                sd.userRoleType = Format.fmtString(results.getObject("user_role_type"));
                sd.errorMsg = "";
            } else {
                sd.errorMsg = "Credentials not found.";
            }

            results.close();
            stmt.close();

        } catch (Exception e) {
            sd.errorMsg = "Exception in DbMods.findByCredentials(): " + e.getMessage();
        }

        return sd;
    }
}