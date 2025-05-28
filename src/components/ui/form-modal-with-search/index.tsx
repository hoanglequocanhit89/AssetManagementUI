import { ReactNode, useEffect, useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import Button from "../button";
import SearchInput from "../search";
import "./style.scss";

interface FormModalWithSearchProps {
    title: string,
    onSearchInput: (data: string) => void,
    onSubmit: () => void,
    closeModal: () => void,
    children: ReactNode
    isDisableSubmit?: boolean
}

const FormModalWithSearch = (props: FormModalWithSearchProps) => {
    const { title, onSearchInput, onSubmit, closeModal, children, isDisableSubmit } = props;
    const [searchInput, setSearchInput] = useState<string>('');
    const debouncedKeyword = useDebounce(searchInput ,500);

    useEffect(() => {
        onSearchInput(debouncedKeyword);
    }, [debouncedKeyword]);

    return (
      <>
        <div className="form-modal__overlay"></div>
        <div className="form-modal-search">
          <div className="form-modal__inner">
            <div className="form-modal__row">
              <h3 className="section-title">{title}</h3>
              <div className="form-modal__search">
                <SearchInput
                  onSearch={(data) => setSearchInput(data)}
                  value={searchInput}
                />
              </div>
            </div>
            <div className="form-modal__search--content w-[30vw] max-h-[80vh] overflow-y-scroll">
              {children}
            </div>
            <div className="form-modal__action">
              <Button
                color="primary"
                text="Save"
                disabled={isDisableSubmit}
                onClick={() => onSubmit()}
              />
              <Button
                color="outline"
                text="Cancel"
                onClick={() => closeModal()}
              />
            </div>
          </div>
        </div>
      </>
    );
};

export default FormModalWithSearch;