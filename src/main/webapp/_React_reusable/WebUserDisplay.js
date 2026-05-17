"use strict";

function WebUserDisplay({ title, user }) {

    return (
        <div className="accountBox">
            <h2>{title}</h2>

            <div className="accountCard">
                <div className="accountImageWrap">
                    <img src={user.userImage} alt="user" className="accountImage" />
                </div>

                <div className="accountInfo">
                    <p><strong>Email:</strong> {user.userEmail}</p>
                    <p><strong>Password:</strong> {user.userPassword}</p>
                    <p><strong>Birthday:</strong> {user.birthday}</p>
                    <p><strong>Membership Fee:</strong> {user.membershipFee}</p>
                    <p><strong>Role:</strong> {user.userRoleType}</p>
                    <p><strong>User ID:</strong> {user.webUserId}</p>
                </div>
            </div>
        </div>
    );
}