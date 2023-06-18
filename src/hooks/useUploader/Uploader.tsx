import { ChangeEventHandler, ComponentPropsWithRef, MouseEventHandler, useRef, useState } from 'react';

import styles from './uploader.module.css';

import CLOSE_ICON from '@/assets/svg/x-lg.svg';
import UPLOAD_ICON from '@/assets/svg/upload.svg';
import FILE_ICON from '@/assets/svg/file-outline.svg';

export type UploaderPropTypes = ComponentPropsWithRef<"div"> & {
    addFromUrl?: boolean;
    uploaderType?: "classic" | "url";
    modalTitle?: string;
    fileListTitle?: string;
    uploadInstruction?: string;
    allowedSizePerFile?: number;
    allowedMimeTypes?: string[];
};

type FileListItemPropTypes = {
    name: string;
    uploaded?: string;
};

export default function useUploader() {
    const [files, setFiles] = useState<File[] | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    let _allowedSizePerFile: number;
    let _allowedMimeTypes: string[];

    /**
     * This function triggers a click event on a file input element when a browse button is clicked.
     */
    const onClickBrowseFile = () => inputRef?.current?.click();

    /**
     * The function sets the value of "files" to null when called.
     */
    const onCloseUploader = () => setFiles(null);

    /**
     * This function validates if a file size is within the allowed limit.
     * @param {number} size - The size parameter is a number representing the size of a file in bytes.
     * @param {number} allowedFileSize - The allowed maximum file size in bytes that a file can have.
     * @returns A boolean value is being returned. If the `size` parameter is greater than the
     * `allowedFileSize` parameter, `false` is returned. Otherwise, `true` is returned.
     */
    const validateFileSize = (size: number, allowedFileSize: number) => {
        if (size > allowedFileSize) return false;
        return true;
    };

    /**
     * The function validates if a given file MIME type is included in a list of allowed types.
     * @param {string} mimeType - a string representing the MIME type of a file.
     * @param {string[]} allowedTypes - an array of strings representing the MIME types that are
     * allowed for a file.
     * @returns A boolean value is being returned. If the `mimeType` is included in the `allowedTypes`
     * array, `true` is returned. Otherwise, `false` is returned.
     */
    const validateFileMimeType = (mimeType: string, allowedTypes: string[]) => {
        if (!mimeType.trim() || !allowedTypes) return;
        if (allowedTypes.includes(mimeType)) return true;
        return false;
    };

    /**
     * This function handles the selection of files and validates their MIME type and size before
     * adding them to a list of files.
     * @param e - e is an event object that is passed to the function when a file is selected using an
     * HTML input element of type "file". It contains information about the selected file(s), such as
     * the file name, size, and type.
     * @returns either an alert message if the file type or size is not allowed, or it is returning
     * nothing if the file is valid.
     */
    const onFileSelected: ChangeEventHandler<HTMLInputElement> = (e) => {
        const _files = e.target.files;
        if (!_files) return;
        let _temp: File[] = [];
        if (files) _temp = [...files];
        for (let i = 0; i < _files.length; i++) {
            // validate mimeType of each file in FileList
            const shouldAllowFileType = validateFileMimeType(_files[i].type, _allowedMimeTypes);
            if (!shouldAllowFileType) {
                return alert(`${_files[i].type.trim() ? _files[i].type : "unknown"} file is not allowed for uploads`);
            }
            // validate file size for each file in FileList
            const shouldAllowFileSize = validateFileSize(_files[i].size, _allowedSizePerFile);
            if (!shouldAllowFileSize) {
                return alert(`${_files[i].name} exceeds allowed file size of ${_allowedSizePerFile / 1000000} MB`);
            }
            _temp.push(_files.item(i) as File);
        }
        setFiles(_temp);
    };

    /**
     * This function removes a file from an array of files based on its filename.
     * @param {string} filename - The filename parameter is a string that represents the name of the
     * file that needs to be removed from the files array.
     * @returns the result of calling `setFiles` with a new array that is a copy of the original
     * `files` array with the specified file removed.
     */
    const onRemoveOneFile = (filename: string) => {
        if (!filename || !files) return;
        const _index = files.findIndex(_file => _file.name === filename);
        if (_index < 0) return;
        files.splice(_index, 1);
        return setFiles([...files]);
    };

    /**
     * This function handles the uploading of files and allows for a custom upload handler to be passed
     * in.
     * @param e - The event object of type `MouseEvent<HTMLButtonElement>`, which contains information
     * about the mouse event that triggered the function.
     * @returns The function `onFileUploaded` does not return anything. It is a callback function that
     * is triggered when a button with a mouse click event is clicked.
     */
    const onFileUploaded: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        if (!files) return;
        const fd = new FormData();
        files.forEach(_file => fd.append("file", _file, _file.name));
        //TODO: File upload endpoint handling - allow to pass custom upload handler and return response
    };

    function FileListItem(props: FileListItemPropTypes) {
        return <div className={`${styles.uploaderFileListItem}`}>
            <FILE_ICON data-id="file-icon" className={`${styles.uploaderIcons}`} />
            <p data-id="filename">{props.name.trimStart()}</p>
            <div className={`${styles.fileUploadProgress}`}>
                <progress value={props.uploaded} max="100"></progress>
                <CLOSE_ICON className={`${styles.uploaderIcons}`} onClick={() => onRemoveOneFile(props.name)} />
            </div>
        </div>;
    }

    function Uploader(props: UploaderPropTypes) {
        const { className, style,
            uploadInstruction = "JPG, PNG or PDF - Max file size 1MB",
            modalTitle = "Upload",
            fileListTitle = "Selected Files",
            uploaderType = "classic",
            addFromUrl = false,
            allowedSizePerFile = 1000000, // 1MB
            allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
            ...rest } = props;

        _allowedSizePerFile = allowedSizePerFile;
        _allowedMimeTypes = allowedMimeTypes;

        return <div className={`${styles.uploaderContainer} ${className}`} style={style} {...rest}>
            <div className={`${styles.uploaderHeader}`}>
                <h3>{modalTitle}</h3>
                <CLOSE_ICON className={`${styles.uploaderIcons}`} onClick={onCloseUploader} />
            </div>
            {
                uploaderType !== "classic" ? false : <form className={`${styles.uploaderForm}`}>
                    <UPLOAD_ICON data-id="upload-form-icon" className={`${styles.uploaderIcons}`} onClick={onClickBrowseFile} />
                    <p>Drag & drop files or <span role="button" onClick={onClickBrowseFile}>browse files</span></p>
                    <p data-id="upload-instruction">{uploadInstruction}</p>
                    <input type='file' hidden multiple data-label="file-input-hidden" ref={inputRef} onChange={onFileSelected} />
                </form>
            }
            {
                files && files.length ? <div className={`${styles.uploaderFileList}`}>
                    <h3>{fileListTitle}</h3>
                    <div className={`${styles.uploaderFileListItems}`}>
                        {
                            files.map((file) => <FileListItem key={file.name} name={file.name} />)
                        }
                    </div>
                </div> : false
            }
            {files && files.length ? <button className={`${styles.uploaderFormButton}`} data-id="upload-action-btn" type="button" onClick={onFileUploaded}>Upload</button> : false}
            {
                addFromUrl ?
                    <>
                        <p data-id="divider">{`OR`}</p>
                        <div className={`${styles.uploaderUrlOptionContainer}`}>
                            <h3>Upload Url</h3>
                            <div className={`${styles.uploaderUrlOptionField}`}>
                                <input placeholder='Add from URL' />
                                <button>Add</button>
                            </div>
                        </div>
                    </> : false
            }
        </div>;
    }

    return { Uploader, files, onFileSelected, onFileUploaded, validateFileSize, validateFileMimeType };
}