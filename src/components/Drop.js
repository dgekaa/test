import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { COLORS, txt } from "../other/constants";
import Dropzone from "react-dropzone";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import { useSelector, useDispatch } from "react-redux";
import { profileActions } from "../store/profile";
import { commonActions } from "../store/common";
import { TextArea } from ".";
import { QUERY_PATH } from "../other/settings";

const ImageAndBtnsBlock = styled.div`
    display: flex;
    border-radius: 5px;
    @media (max-width: 768px) {
      flex-direction: column;
      margin: 0;
    }
  `,
  ImageBlock = styled.div`
    display: flex;
    width: 320px;
    height: 180px;
    background: ${COLORS.DARK};
    padding: ${({ images }) => images && "0 10px 10px 0"};
    @media (max-width: 768px) {
      padding: 0 0 10px 0;
      margin: 0 auto;
      width: 100%;
      height: calc(100vw / 1.777);
    }
  `,
  Image = styled.div`
    cursor: pointer;
    display: flex;
    width: 320px;
    background-image: ${({ src }) => src};
    border-radius: 5px;
    background-color: ${COLORS.LIGHT_DARK};
    justify-content: center;
    align-items: center;
    color: ${COLORS.LIGHT};
    font-weight: bold;
    position: relative;
    overflow: hidden;
    background-repeat: no-repeat;
    @media (max-width: 768px) {
      width: 100%;
    }
  `,
  ImageText = styled.div`
    text-align: center;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    opacity: 0.7;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    flex-direction: column;
    font-size: 12px;
  `,
  ImageTextMain = styled.span`
    padding-top: 5px;
    font-size: 10px;
  `,
  RightContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    @media (max-width: 768px) {
      align-items: center;
      margin-top: 10px;
      margin-left: 0;
      flex-direction: column;
    }
  `,
  Btns = styled.div`
    display: flex;
    flex-direction: column;
    width: 250px;
    @media (max-width: 768px) {
      flex-direction: row;
      margin: 10px 0;
      width: 100%;
    }
  `,
  BtnsNewImage = styled.div`
    display: flex;
    flex-direction: column;
    width: 250px;
    @media (max-width: 768px) {
      flex-direction: column;
      margin: 10px 0;
      width: 100%;
    }
  `,
  RightBtn = styled.div`
    display: flex;
    background: ${COLORS.LIGHT_DARK};
    justify-content: center;
    align-items: center;
    height: 35px;
    transition: 0.2s ease color;
    color: ${COLORS.LIGHT};
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    text-transform: uppercase;
    margin-top: ${({ first }) => (first ? 0 : "10px")};
    &:hover {
      color: ${({ red }) => (red ? COLORS.ERROR_COLOR : COLORS.SUCCESS_COLOR)};
    }

    @media (max-width: 768px) {
      text-align: center;
      font-size: 12px;
      margin: 0;
      width: 50%;
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
  `,
  BtnsInner = styled.div`
    display: flex;
    flex-direction: column;
    &:first-child {
      margin-top: 0;
    }
    @media (max-width: 768px) {
      flex-direction: row;
      &:last-child {
        margin-top: 10px;
      }
    }
  `,
  Area = styled.div`
    margin-right: 10px;
    background: ${COLORS.DARK};
    width: 100%;
    border-radius: 5px;
    @media (max-width: 768px) {
      margin-right: 0;
      margin-top: -7px;
    }
  `,
  Img = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 5px;
  `,
  ImageInput = styled.input`
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
    opacity: 0;
  `;

export const Drop = React.memo(({ imgcount }) => {
  const dispatch = useDispatch();

  const { place, imgSrc, imgDesc, isNewImage } = useSelector(
      (st) => st.profile
    ),
    { lng } = useSelector((state) => state.common);

  const imageElementRef = useRef(null);

  const [imageDestination, setImageDestination] = useState("");

  useEffect(() => {
    if (imageElementRef.current) {
      const cropper = new Cropper(imageElementRef.current, {
        zoomable: true,
        scalable: false,
        dragMode: "move",
        aspectRatio: 16 / 9,
        rotatable: true,
        minCropBoxWidth: 50,
        movableL: true,
        modal: true,
        imageSmoothingEnabled: true,
        crop: (e) => {
          const canvas = cropper.getCroppedCanvas();
          canvas.toBlob(
            function (blob) {
              blob && setImageDestination(blob);
            },
            "image/jpeg",
            0.9
          );
        },
      });
    }
  }, [imgSrc]);

  const imageMaxSize = 10000000000,
    acceptedFileTypes = "image/x-png, image/png, image/jpg, image/jpeg",
    acceptedFileTypesArray = acceptedFileTypes
      .split(",")
      .map((item) => item.trim());

  const verifyFile = (files) => {
      if (files && files.length > 0) {
        const cur = files[0],
          curType = cur.file ? cur.file.type : cur.type,
          curSize = cur.file ? cur.file.size : cur.size;

        if (curSize > imageMaxSize) {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.largeimg }));
          return false;
        }
        if (!acceptedFileTypesArray.includes(curType)) {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.onlyimg }));
          return false;
        }
        return true;
      }
    },
    onDrop = (files, rejectedFiles) => {
      if (rejectedFiles && rejectedFiles.length > 0) verifyFile(rejectedFiles);
      if (files && files.length > 0) {
        if (verifyFile(files)) {
          const curFile = files[0],
            reader = new FileReader();

          reader.addEventListener(
            "load",
            () => {
              dispatch(profileActions.setImgSrc(null));
              dispatch(profileActions.setImgSrc(reader.result));
            },
            false
          );
          reader.readAsDataURL(curFile);
        }
      }
    },
    saveImage = (e) => {
      dispatch(profileActions.fetchUploadImage(place.id, imageDestination));
    },
    clearImage = () => {
      dispatch(profileActions.setImgSrc(null));
    },
    setImgDesc = (text) => {
      dispatch(profileActions.setImgDesc(text));
    },
    maxImageCount = () => {
      if (imgcount === 10 && !isNewImage) {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.image10 }));
      }
    },
    changeMainImage = () => {
      dispatch(profileActions.fetchChangeMainImage(place.id, isNewImage.img));
    },
    deleteImage = () => {
      dispatch(
        profileActions.fetchUpdateImage(
          place.id,
          null,
          isNewImage.img.id,
          isNewImage.index
        )
      );
    },
    saveDesc = () => {
      dispatch(profileActions.fetchUpdateImgDesc(place.id, isNewImage.img.id));
    },
    cancelNewImage = () => {
      setImgDesc("");
      dispatch(profileActions.setNewImage(null));
    };

  return (
    <ImageAndBtnsBlock>
      <ImageBlock images={place.images[0]}>
        {imgSrc ? (
          <Image>
            <img
              ref={imageElementRef}
              src={imgSrc}
              alt="src"
              onError={(err) => {
                dispatch(profileActions.setImgSrc(null));
                dispatch(
                  commonActions.setErr({ ownErr: txt[lng].err.onlyimg })
                );
              }}
            />
          </Image>
        ) : (
          <Dropzone
            onDrop={onDrop}
            maxSize={imageMaxSize}
            multiple={false}
            accept={acceptedFileTypes}
          >
            {({ getRootProps, getInputProps }) => (
              <Image {...getRootProps()} onClick={maxImageCount}>
                <>
                  {place.images[0] && !isNewImage && (
                    <Img
                      alt="curImage"
                      src={`${QUERY_PATH}/imgcache/320/180/storage/${place.images[0].url}`}
                    />
                  )}

                  {isNewImage && (
                    <Img
                      alt="newImage"
                      src={`${QUERY_PATH}/imgcache/320/180/storage/${isNewImage.img.url}`}
                    />
                  )}

                  {imgcount < 10 && !isNewImage && (
                    <ImageText>
                      {txt[lng].drop.addim} <br />
                      <ImageTextMain>{txt[lng].drop.imagetxt}</ImageTextMain>
                    </ImageText>
                  )}

                  {imgcount < 10 && !isNewImage && (
                    <ImageInput {...getInputProps()} style={{ opacity: 0 }} />
                  )}
                </>
              </Image>
            )}
          </Dropzone>
        )}
      </ImageBlock>

      {imgSrc && !isNewImage && (
        <RightContainer>
          <Area>
            <TextArea
              max={100}
              height="170px"
              placeholder={txt[lng].drop.desc}
              value={imgDesc || ""}
              changeText={(e) => setImgDesc(e)}
            />
          </Area>

          <Btns>
            <RightBtn first onClick={saveImage}>
              {txt[lng].drop.saveim}
            </RightBtn>
            <RightBtn red onClick={clearImage}>
              {txt[lng].drop.cancel}
            </RightBtn>
          </Btns>
        </RightContainer>
      )}

      {isNewImage && (
        <RightContainer>
          <Area>
            <TextArea
              max={100}
              height="170px"
              placeholder={txt[lng].drop.desc}
              value={imgDesc || ""}
              changeText={(e) => setImgDesc(e)}
            />
          </Area>

          <BtnsNewImage>
            <BtnsInner>
              <RightBtn first onClick={saveDesc}>
                {txt[lng].drop.save}
              </RightBtn>
              <RightBtn onClick={cancelNewImage}>
                {txt[lng].drop.cancel}
              </RightBtn>
            </BtnsInner>

            <BtnsInner>
              <RightBtn onClick={changeMainImage}>
                {txt[lng].drop.main}
              </RightBtn>
              <RightBtn red onClick={deleteImage}>
                {txt[lng].drop.del}
              </RightBtn>{" "}
            </BtnsInner>
          </BtnsNewImage>
        </RightContainer>
      )}
    </ImageAndBtnsBlock>
  );
});
