import React, { useState, useEffect } from 'react'
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useStateProviderValue } from "../StateProvider";
import db from "../firebase";
import "./AvatarModal.css";
import { useParams } from "react-router-dom";
import Radio from '@material-ui/core/Radio';
import { storage } from "../firebase";

function AvatarModal({ openAvatar, handleCloseAvatar, avatarImg }) {
    const { roomId } = useParams();
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [{ avatarUrl }, dispatch] = useStateProviderValue();
    const [avatarImage, setAvatarImg] = useState({
        hair: avatarImg ? avatarImg.hair : "",
        skin: avatarImg ? avatarImg.skin : "",
        facialHair: avatarImg ? avatarImg.facialHair : "",
        clothes: avatarImg ? avatarImg.clothes : ""
    });
    const [selectedValue, setSelectedValue] = React.useState('Avatar');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };


    const resetValues = (event) => {
        setAvatarImg({
            hair: avatarImg ? avatarImg.hair : "",
            skin: avatarImg ? avatarImg.skin : "",
            facialHair: avatarImg ? avatarImg.facialHair : "",
            clothes: avatarImg ? avatarImg.clothes : ""
        });
    };

    const closeModal = (event) => {
        handleCloseAvatar();
        resetValues();
    };

    const url = `https://avataaars.io/?avatarStyle=Transparent&topType=${avatarImage.hair}&accessoriesType=Blank&hairColor=BrownDark&facialHairType=${avatarImage.facialHair}&clotheType=${avatarImage.clothes}&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=${avatarImage.skin}`;
    useEffect(() => {
        if (avatarImg) {
            setAvatarImg(({ hair: avatarImg.hair, skin: avatarImg.skin, facialHair: avatarImg.facialHair, clothes: avatarImg.clothes }));
        }
    }, [avatarImg, roomId]);


    const handleAvatarHair = (event) => {
        if (image) {
            clearImage();
        }
        setAvatarImg({
            ...avatarImage,
            hair: event.target.value,
        });
    }

    const handleAvatarSkin = (event) => {
        if (image) {
            clearImage();
        }
        setAvatarImg({
            ...avatarImage,
            skin: event.target.value,
        });
    }

    const handleAvatarFacialHair = (event) => {
        if (image) {
            clearImage();
        }
        setAvatarImg({
            ...avatarImage,
            facialHair: event.target.value,
        });
    }

    const handleAvatarClothes = (event) => {
        if (image) {
            clearImage();
        }
        setAvatarImg({
            ...avatarImage,
            clothes: event.target.value,
        });
    }

    const chooseImage = (event) => {
        let reader = new FileReader();
        let file = event.target.files[0];
        if (file) {
            reader.onloadend = () => {
                setImage(file);
                setImageUrl(reader.result);
            };

            reader.readAsDataURL(file);
        }
        /*     if (file) {
          setImage(file);
        } */
    };

    const clearImage = () => {
        setImage(null);
        setImageUrl("");
    };

    const updateAvatar = (event) => {
        if (!image) {
            dispatch({
                type: "SET_AVATAR",
                avatarUrl: url,
            });
            db.collection("rooms")
                .doc(roomId)
                .update({
                    avatarUrl:
                        url,
                    avatarImg: {
                        hair: avatarImage.hair,
                        skin: avatarImage.skin,
                        facialHair: avatarImage.facialHair,
                        clothes: avatarImage.clothes
                    }
                });
        } else {
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    /* const progress = Math.round(
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress); */
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    storage
                        .ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then((url) => {
                            db.collection("rooms")
                                .doc(roomId)
                                .update({
                                    avatarUrl:
                                        url,
                                    avatarImg: {
                                        hair: "ShortHairTheCaesar",
                                        skin: "Light",
                                        facialHair: "Blank",
                                        clothes: "BlazerShirt"
                                    }
                                });
                        });
                }
            );
        }
        handleCloseAvatar();
        clearImage();
    };



    const avatarEdit = (
        <div className="formControlContainer">
            <FormControl className="fromControl" style={{ display: "flex" }}>
                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                    Hair
        </InputLabel>
                <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={avatarImage.hair}
                    onChange={handleAvatarHair}

                    displayEmpty
                >
                    <MenuItem value="ShortHairTheCaesar">ShortHairTheCaesar</MenuItem>
                    <MenuItem value="ShortHairShortWaved">ShortHairShortWaved</MenuItem>
                    <MenuItem value="ShortHairShortFlat">ShortHairShortFlat</MenuItem>
                    <MenuItem value="LongHairFro">LongHairFro</MenuItem>
                    <MenuItem value="LongHairStraight">LongHairStraight</MenuItem>
                    <MenuItem value="LongHairStraightStrand">LongHairStraightStrand</MenuItem>
                    <MenuItem value="None">None</MenuItem>
                </Select>
            </FormControl>
            <FormControl className="fromControl" style={{ display: "flex" }}>
                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                    Skin
        </InputLabel>
                <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={avatarImage.skin}
                    onChange={handleAvatarSkin}

                    displayEmpty
                >
                    <MenuItem value="Light">Light</MenuItem>
                    <MenuItem value="Tanned">Tanned</MenuItem>
                    <MenuItem value="Yellow">Yellow</MenuItem>
                    <MenuItem value="Pale">Pale</MenuItem>
                    <MenuItem value="Black">Black</MenuItem>
                    <MenuItem value="Brown">Brown</MenuItem>
                </Select>
            </FormControl>
            <FormControl className="fromControl" style={{ display: "flex" }}>
                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                    Facial hair
        </InputLabel>
                <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={avatarImage.facialHair}
                    onChange={handleAvatarFacialHair}

                    displayEmpty
                >
                    <MenuItem value="Blank">Blank</MenuItem>
                    <MenuItem value="BeardMedium">BeardMedium</MenuItem>
                    <MenuItem value="BeardLight">BeardLight</MenuItem>
                    <MenuItem value="MoustacheMagnum">MoustacheMagnum</MenuItem>
                    <MenuItem value="MoustacheFancy">MoustacheFancy</MenuItem>
                </Select>
            </FormControl>
            <FormControl className="fromControl" style={{ display: "flex" }}>
                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                    Clothes
        </InputLabel>
                <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={avatarImage.clothes}
                    onChange={handleAvatarClothes}

                    displayEmpty
                >
                    <MenuItem value="BlazerShirt">BlazerShirt</MenuItem>
                    <MenuItem value="BlazerSweater">BlazerSweater</MenuItem>
                    <MenuItem value="CollarSweater">CollarSweater</MenuItem>
                    <MenuItem value="GraphicShirt">GraphicShirt</MenuItem>
                    <MenuItem value="Hoodie">Hoodie</MenuItem>
                    <MenuItem value="Overall">Overall</MenuItem>
                </Select>
            </FormControl>
        </div>
    );


    const uploadImage = (
        <div style={{ padding: "30px 0px" }}>
            <Button variant="contained" color="secondary" component="label">
                Upload
                <input
                    onChange={chooseImage}
                    type="file"
                    style={{ display: "none" }}
                />
            </Button>
            <Button style={{ marginLeft: "10px" }} variant="contained" color="default" component="label" onClick={clearImage}>
                Clear
            </Button>
        </div>
    );

    return (
        <div>
            <Dialog
                maxWidth="xs"
                open={openAvatar}
                onClose={closeModal}
                aria-labelledby="form-dialog-title"
            >
                {console.log(avatarImage)}
                <DialogTitle id="form-dialog-title">Edit your avatar</DialogTitle>
                <DialogContent>
                    <div>
                        <img src={image ? imageUrl : url} style={{ maxWidth: "400px" }} />
                    </div>
                    <Radio
                        checked={selectedValue === 'Avatar'}
                        onChange={handleChange}
                        value="Avatar"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': 'A' }}
                    />
                    <span>Edit Avatar</span>
                    <Radio
                        checked={selectedValue === 'Upload'}
                        onChange={handleChange}
                        value="Upload"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': 'B' }}
                    />
                    <span>Upload image</span>

                    {selectedValue === "Avatar" ? avatarEdit : uploadImage}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal} color="primary">
                        Cancel
          </Button>
                    <Button onClick={updateAvatar} color="primary">
                        EDIT
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AvatarModal
