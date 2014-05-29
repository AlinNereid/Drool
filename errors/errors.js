/**
 * Created by alin on 5/23/14.
 */

var errorsObj={
    0100:"The api doesn't exist.",
    0101:"An api with this name already exists.",
    0102:"The URL or the fields of the ticker are incorrect.",
    0103:"Real coin does not exist.",
    0104:"Digital coin does not exist.",
    0105:"The value of the request time is too low.",
    0106:"Required parameters are not specified.",
    0107:"Error in updating api.",
    0108:"The name of the api can't be 'Any api'",
    0200:"Required parameters don't have a proper value.",
    0201:"Required parameters are not specified.",
    0300:"The token is invalid",
    0301:"The token does not exist",
    0400:"Error in updating digital coin.",
    0401:"Exists a real coin with the same name.",
    0402:"Digital coin does not exist",
    0403:"Required parameters are not specified.",
    0404:"Error in adding digital coin.",
    0500:"Real coin does not exist.",
    0600:"The number of hours and the number of points must be positive.",
    0601:"Required parameters don't have a proper value.",
    0602:"Required parameters are not specified.",
    0603:"Number of points exceeds the maximum number of points",
    0604:"Start date is not valid"
}

exports.errors=errorsObj;