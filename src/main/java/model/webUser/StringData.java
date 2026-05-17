package model.webUser;

public class StringData {
    public String webUserId = "";
    public String userEmail = "";
    public String userPassword = "";
    public String userPassword2 = "";
    public String userImage = "";
    public String birthday = "";
    public String membershipFee = "";
    public String userRoleId = "";
    public String userRoleType = "";
    public String errorMsg = "";

    public int characterCount() {
        String[] fields = {
            webUserId,
            userEmail,
            userPassword,
            userPassword2,
            userImage,
            birthday,
            membershipFee,
            userRoleId,
            userRoleType,
            errorMsg
        };

        int count = 0;
        for (String field : fields) {
            if (field != null) {
                count += field.length();
            }
        }
        return count;
    }
}