package com.ymougenel.app_api.persistence

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import org.springframework.stereotype.Service
import com.ymougenel.app_api.entities.Score

@Service
interface ScoreDAO : JpaRepository<Score, Long> {

}
