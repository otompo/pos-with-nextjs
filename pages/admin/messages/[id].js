import { getSession } from 'next-auth/client';
import SingleMessage from '../../../components/admin/SingleMessage';

const SingleMessageIndex = () => {
  return (
    <>
      <SingleMessage />
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || !session.user.role.includes('Admin')) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
export default SingleMessageIndex;
