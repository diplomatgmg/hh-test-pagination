import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import Pagination from 'react-bootstrap/Pagination';
import {Alert, Container} from "react-bootstrap";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import * as querystring from "node:querystring";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

const inter = Inter({subsets: ["latin"]});

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TQueryParams = {
  page?: string;
}

type TGetServerSideProps = {
  statusCode: number
  users: TUserItem[]
  queryParams?: TQueryParams
}


export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const res = await fetch(`http://localhost:3000/users?${querystring.stringify(ctx.query)}`, {method: 'GET'})
    if (!res.ok) {
      return {props: {statusCode: res.status, users: []}}
    }

    return {
      props: {statusCode: 200, users: await res.json(), queryParams: ctx.query}
    }
  } catch (e) {
    return {props: {statusCode: 500, users: []}}
  }
}) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home({statusCode, users, queryParams}: TGetServerSideProps) {
  const [page, setPage] = useState<number>(queryParams?.page ? Number(queryParams.page) : 1)
  const router = useRouter()

  useEffect(() => {
    void router.replace({
      pathname: router.pathname,
      query: {...router.query, page}
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }

  const paginationNumbers = Array.from({length: 10}, (_, index) => index + 1)

  const handleChangePage = (newPage: number) => (): void => {
    setPage(newPage)
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>

          <Pagination>
            <Pagination.First/>
            <Pagination.Prev/>
            {paginationNumbers.map(number => (
              <Pagination.Item
                key={number}
                onClick={handleChangePage(number)}
                active={page === number}>{number}</Pagination.Item>
            ))}
            <Pagination.Next/>
            <Pagination.Last/>
          </Pagination>

        </Container>
      </main>
    </>
  );
}
