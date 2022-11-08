import {
  getPlatforms,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonRow,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Post } from '../../api/types';
import FullScreenLoadingSpinner from '../../components/FullScreenLoadingSpinner';
import PostListItem from '../../components/PostListItem';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  getInitialPostsData,
  getNextPageOfPosts,
} from '../../redux/slices/postsSlice';
import { CREATE_POST } from '../../routes';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import usePageInitialLoad from '../../util/hooks/usePageInitialLoad';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import NoData from '../NoData';
import SelectedPost from './SelectedPost';
import styles from './styles.module.scss';

export default function PostsPageBody() {
  const history = useHistory();
  const listOfPosts = useAppSelector((state) => state.posts.posts);
  const isLoading = useAppSelector((state) => state.posts.isLoading);
  const dispatch = useAppDispatch();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const isMobile = getPlatforms().includes('mobile');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (selectedPost !== null) {
    //do a check if post is still in list of posts
    const listFiltered = listOfPosts.filter(
      (post) => post.id === selectedPost.id
    );
    if (listFiltered.length === 0) {
      setSelectedPost(null);
    }
  }

  const setPostOnClick = (post: Post) => setSelectedPost(post);

  // eslint-disable-next-line
  function requestNextPageOfPosts(ev: any) {
    if (listOfPosts.length < 20) {
      ev.target.complete(); //eslint-disable-line
      return;
    }
    dispatch(getNextPageOfPosts())
      .unwrap()
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message as string);
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      })
      .finally(() => {
        ev.target.complete(); // eslint-disable-line
      });
  }

  // fetch the data right before this scren is opened
  usePageInitialLoad(() => {
    dispatch(getInitialPostsData())
      .unwrap()
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message as string);
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      });
  });

  return (
    <>
      {isLoading && <FullScreenLoadingSpinner />}
      {!isLoading && (
        <>
          {listOfPosts.length === 0 ? (
            <NoData>
              <div>
                <p className="ion-text-center">No study sessions!</p>
                <IonButton
                  onClick={() => {
                    history.replace(CREATE_POST);
                  }}
                  expand="block"
                >
                  Create a study session
                </IonButton>
              </div>
            </NoData>
          ) : isMobile ? (
            <IonList>
              {listOfPosts.map((data) => {
                return (
                  <PostListItem
                    selected={selectedPost?.id === data.id}
                    post={data}
                    key={data.id}
                    onClick={setPostOnClick}
                  ></PostListItem>
                );
              })}
            </IonList>
          ) : (
            <IonGrid className={`ion-no-padding ${styles['desktop-grid']}`}>
              <IonRow
                className={`ion-justify-content-center ion-no-padding ${styles['desktop-row']}`}
              >
                <IonCol size={isMobile ? '12' : '5'}>
                  : (
                  <IonContent>
                    <IonList>
                      {listOfPosts.map((data) => {
                        return (
                          <PostListItem
                            selected={selectedPost?.id === data.id}
                            post={data}
                            key={data.id}
                            onClick={setPostOnClick}
                          ></PostListItem>
                        );
                      })}
                    </IonList>

                    <IonInfiniteScroll
                      onIonInfinite={requestNextPageOfPosts}
                      threshold="100px"
                      disabled={listOfPosts.length < 20}
                    >
                      <IonInfiniteScrollContent loadingSpinner="circles"></IonInfiniteScrollContent>
                    </IonInfiniteScroll>
                  </IonContent>
                  )
                </IonCol>
                {!isMobile && (
                  <IonCol size="7">
                    <IonContent>
                      <SelectedPost post={selectedPost} />
                    </IonContent>
                  </IonCol>
                )}
              </IonRow>
            </IonGrid>
          )}
          {isMobile && (
            <IonInfiniteScroll
              onIonInfinite={requestNextPageOfPosts}
              threshold="100px"
            >
              <IonInfiniteScrollContent loadingSpinner="circles"></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          )}
        </>
      )}
    </>
  );
}
