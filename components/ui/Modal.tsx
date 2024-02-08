import Modal from 'react-modal';


<Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    style={customStyles}
    contentLabel="Example Modal"
>
    <div className="flex justify-between">
        <h3 className="mt-2 text-lg font-semibold text-gray-700">
            {selectedBook?.name}
        </h3>
        <Button
            className="hover:font-bold rounded hover:bg-gray-700 p-2 w-20 hover:text-white "
            onClick={closeModal}
        >
            Close
        </Button>
    </div>
    <div>
        <div className='flex justify-center py-10'>
            <div className="w-48 h-72">
                <img
                    src={selectedBook?.image}
                    alt={"Thumbnail of the book " + selectedBook?.name}
                    className="w-full h-full rounded-lg shadow-lg"
                />
            </div>
        </div>
        <div>

            <p>{selectedBook?.description}</p>

            <div className="flex justify-center">
                {/* <a
                className="hover:animate-pulse"
                target="_blank"
                href={'https://www.amazon.com/s?k=' + selectedBook?.isbn10}
              >
                <img
                  className="w-60"
                  src="https://kentuckynerd.com/wp-content/uploads/2019/05/amazon-buy-now-button.jpg"
                />
              </a> */}
            </div>
        </div>

    </div>
</Modal>