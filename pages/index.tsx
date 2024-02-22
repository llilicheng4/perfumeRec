import { SyntheticEvent, useState } from 'react';
import CircleLoader from 'react-spinners/CircleLoader';
import Modal from 'react-modal';
import { Perfume } from 'types';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '90%',
    height: '80%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '5px',
  },
};
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [query, setQuery] = useState('');
  const [userInterests, setUserInterests] = useState('');
  const [recommendedPerfumes, setRecommendedPerfumes] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedPerfume, setSelectedperfume] = useState<Perfume | undefined>(undefined);
  const [personalizeIsLoading, personalizeSetIsLoading] = useState(false);
  const [personalizeLoadedOnce, personalizeSetLoadedOnce] = useState(false);
  const [personalizeText, setPersonalizeText] = useState('');

  const openModal = (perfume_name: string) => {
    const perfumeSelection = recommendedPerfumes.filter((perfume: Perfume) => {
      return perfume.name === perfume_name;
    });

    console.log(perfumeSelection);
    setSelectedperfume(perfumeSelection[0]);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const getPersonalization = async (perfume: Perfume) => {
    personalizeSetIsLoading(true);
    var userDescription = userInterests;
    await fetch('/api/describe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userDescription,
        perfume,
      })
    })
      .then((res) => {
        console.log(res)
        if (res.ok) return res.json();
      })
      .then((summary) => {
        console.log(summary);
        setPersonalizeText(summary);
      });

    personalizeSetIsLoading(false);
    personalizeSetLoadedOnce(true);
  }


  const getRecommendations = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Check Inputs
    if (query === '') {
      alert("Please Describe Your Perfect Fragrance!");
      return;
    }

    setIsLoading(true);

    await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        userInterests,
      })
    })
      .then((res) => {
        console.log(res)
        if (res.ok) return res.json();
      })
      .then((recommendations) => {
        console.log(recommendations.data.Get.Perfume);
        setRecommendedPerfumes(recommendations.data.Get.Perfume);
      });

    setIsLoading(false);
    setLoadedOnce(true);
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-gray-100">

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="flex justify-between">
          <h3 className="mt-2 text-lg font-semibold text-gray-700">
            {selectedPerfume?.name}
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
                src={selectedPerfume?.image}
                alt={"Thumbnail of the perfume " + selectedPerfume?.name}
                className="w-full h-full rounded-lg shadow-lg"
              />
            </div>
          </div>
          <div>

            <p>{selectedPerfume?.description || selectedPerfume?.summary}</p>

            <div className="flex justify-center">
              {/* <a
                className="hover:animate-pulse"
                target="_blank"
                href={'https://www.amazon.com/s?k=' + selectedPerfume?.isbn10}
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
      <div className="mb-auto py-10 px-4 bg-gray-100">
        <div className="container mx-auto">
          <h1 className="text-3xl font-black font-bold mb-6 text-center">
            Perfume Recommendations
          </h1>

          <form
            id="recommendation-form"
            className="mb-10"
            onSubmit={getRecommendations}
          >
            <div className="mb-4">
              <label
                htmlFor="favorite-perfumes"
                className="block text-gray-700 font-bold mb-2"
              >
                Describe your perfect perfume!
              </label>
              <Input
                type="text"
                id="favorite-perfumes"
                name="favorite-perfumes"
                placeholder="My perfect perfume..."
                className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm "
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
              {process.env.NEXT_PUBLIC_COHERE_CONFIGURED && (
                <>
                  <label
                    htmlFor="interests-input"
                    className="block text-gray-700 font-bold mb-2 pt-4"
                  >
                    Your interests and hobbies
                  </label>
                  <Input
                    type="text"
                    id="interests-input"
                    name="interests"
                    placeholder="Tell us about your hobbies and interests, comma separated..."
                    className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm "
                    value={userInterests}
                    onChange={(e) => {
                      setUserInterests(e.target.value);
                    }}
                  />
                </>
              )}

            </div>
            <Button className="bg-black text-white w-full rounded-md hover:bg-gray-800 hover:text-white" disabled={isLoading} type="submit" variant="outline">
              Get Recommendations
            </Button>

          </form>

          {isLoading ? (
            <div className="w-full flex justify-center h-60 pt-10">
              <CircleLoader
                color={'#000000'}
                loading={isLoading}
                size={100}
                aria-label="Loading"
                data-testid="loader"
              />
            </div>
          ) : (
            <>
              {loadedOnce ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    Recommended Perfumes
                  </h2>
                  <div
                    id="recommended-perfumes"
                    className="flex overflow-x-scroll pb-10 hide-scroll-bar"
                  >
                    {/* <!-- Recommended perfumes dynamically added here --> */}
                    <section className="container mx-auto mb-12">
                      <div className="flex flex-wrap -mx-2">
                        {recommendedPerfumes.map((perfume: Perfume) => {
                          return (
                            <div key={perfume.name || perfume.brand} className="w-full md:w-1/3 px-2 mb-4 animate-pop-in">
                              <div className="bg-white p-6 flex items-center flex-col">
                                <div className='flex justify-between w-full'>
                                  <h3 className="text-xl font-semibold mb-4 line-clamp-1">{perfume.name}</h3>
                                  {(
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button className='rounded-full p-2 bg-black cursor-pointer w-10 h-10' onClick={() => { getPersonalization(perfume) }}>✨</Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-80 h-80 overflow-auto">
                                        <div>
                                          {/* <p className='text-2xl font-bold'>Why you&apos;ll like this perfume:</p>
                                          <br />
                                          <p>{perfume._additional.generate.singleResult}</p> */}

                                          {personalizeIsLoading ? (
                                            <div className="w-full flex justify-center h-60 pt-10">
                                              <CircleLoader
                                                color={'#000000'}
                                                loading={personalizeIsLoading}
                                                size={100}
                                                aria-label="Loading"
                                                data-testid="loader"
                                              />
                                            </div>
                                          ) : (
                                            <>{personalizeLoadedOnce ? (<p>{personalizeText}</p>
                                            ) : (
                                              <div className="w-full flex justify-center h-60 pt-10"></div>
                                            )}
                                            </>
                                          )}
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  )}

                                </div>
                                <div className='w-48 h-72'>
                                  <img
                                    src={perfume.image}
                                    alt={"Thumbnail of the perfume " + perfume.name}
                                    className="w-full h-full rounded-lg shadow-lg"
                                  />
                                </div>
                                <p className="mt-4 text-gray-500 line-clamp-1">{perfume.brand}</p>
                                <div className='flex'>
                                  <Button className="bg-black text-white w-full rounded-md hover:bg-gray-800 hover:text-white" type="submit" variant="outline" onClick={() => { openModal(perfume.name) }}>
                                    Learn More
                                  </Button>
                                </div>
                              </div>
                            </div>

                          );
                        })}
                      </div>
                    </section>
                  </div>
                </>
              ) : (
                <div className="w-full flex justify-center h-60 pt-10"></div>
              )}

            </>
          )}
        </div>


      </div >
    </div >
  );
}
