function rolecheck(req, res, next) {
    const occupation = req.user.occupation
    const allowedRoles = ["Teacher", "Student", "Admin"]

    if (allowedRoles.includes(occupation)) {
        return next()
    } else {
        return res.status(403).send("Access denied")
    }
}

module.exports={
    rolecheck
}